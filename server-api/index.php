<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
}

include 'db.php';

function getDict($name, $language = 'ru') {
	$path = './dictionary/'.$name.'.php';
	if (file_exists($path)) {
		include $path;
		if (is_array($dict)) {
			return $dict;
		}
	}
	return array();
}

function getHelp($name, $language = 'ru') {
	$path = './dictionary/help/'.$name.'.php';
	if (file_exists($path)) {
		include $path;
		if (is_array($help)) {
			return array($name => $help);
		}
	}
}

function auth() {
	$login    = $_POST['login'];
	$password = $_POST['password'];
	if (empty($login) || empty($password)) {
		error('Введите логин и пароль');
	}
	$password = md5($password);
	global $db;
	$r = $db->prepare('
		SELECT 
			id,
			blocked_by 
		FROM 
			users 
		WHERE 
			login = ? and password = ?
	');
	$r->execute(array($login, $password));
	$user = $r->fetch(PDO::FETCH_ASSOC);
	if ($user['blocked_by'] != null) {
		error('Ваш аккаунт был заблокирован, авторизация невозможна');
	}

	createSession($user['id']);
	error('Неверная связка логин/пароль');
}

function createSession($userId) {
	global $db;
	if (!empty($userId)) {
		$r = $db->prepare('
			SELECT 
				token
			FROM 
				sessions 
			WHERE 
				user_id = ?
		');
		$r->execute(array($userId));
		$session = $r->fetch(PDO::FETCH_ASSOC);
		if (is_array($session)) {
			$token = $session['token'];
			$r = $db->prepare('
				UPDATE 
					sessions 
				SET
					timestamp = ?
				WHERE 
					user_id = ?
			');
			$r->execute(array(strtotime('now'), $userId));
		} else {
			$token = generateUniqueToken('sessions');
			$r = $db->prepare('
				INSERT INTO  
					sessions
				VALUES( 
					"", ?, ?, ?
				)
			');
			$r->execute(array($userId, $token, strtotime('now')));
		}

		success(array(
			'token' => $token
		));
	}
}

function register($user = null) {
	global $db;
	$byAdmin = !empty($user);

	if ($byAdmin && $user['role'] != 'head' && $user['role'] != 'admin') {
		noRightsError();
	}

	$login    = validateLogin($_POST['login']);
	$password = validatePassword($_POST['password'], $_POST['password2']);
	$userName = validateUserName($_POST['userName']);
	$email    = validateEmail($_POST['email']);
	$code     = validateInvitationCode($_POST['code']);

	$invitationRole = null;
	$invitationTeam = null;
	$byInvitation = false;
	if ($byAdmin) {
		$role     = validateRole($_POST['role']);
		$spec     = validateSpec($_POST['spec'], $role);
		$projects = validateProjects($_POST['projects'], $role);
	} elseif (!empty($code)) {
		$r = $db->prepare('
			SELECT 
				team_id,
				role_id 
			FROM 
				invitations 
			WHERE 
				token = ?
		');
		$r->execute(array($code));
		$row = $r->fetch(PDO::FETCH_ASSOC);
		if (!is_array($row)) {
			error('Приглашение на найдено');
		}
		$byInvitation = true;
		$invitationRole = $row['role_id'];
		$invitationTeam = $row['team_id'];
	}
	
	$r = $db->prepare('
		SELECT 
			* 
		FROM 
			users 
		WHERE 
			login = ? OR
			password = ? OR 
			email = ?
	');
	$r->execute(array($login, $password, $email));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	validateUniqueness($login, $password, $email, $row);

	$token = generateUniqueToken('users');
	$team = $byAdmin ? $user['team_id'] : null;
	$role = $byAdmin ? $role : 1;
	$spec = $byAdmin ? $spec : null;
	if ($byInvitation === true) {
		$role = $invitationRole;
		$team = $invitationTeam;
		$projects = getInvitaionProjects($code);

		$r = $db->prepare('
			DELETE FROM 
				invitations_projects 
			WHERE 
				invitation_id = (SELECT id FROM invitations WHERE token = ?)
		');
		$r->execute(array($code));
		$r = $db->prepare('
			DELETE FROM 
				invitations 
			WHERE 
				token = ?
		');
		$r->execute(array($code));
	}
	$r = $db->prepare('
		INSERT INTO  
			users
		VALUES( 
			"", ?, ?, ?, ?, ?, ?, ?, null, ?, null, ?
		)
	');
	$avatarId = getRandomAvatar($team);
	$r->execute(array($userName, $email, $token, $login, md5($password), $role, $spec, $team, $avatarId));

	$r = $db->prepare('
		SELECT 
			id
		FROM 
			users 
		WHERE 
			token = ?
	');
	$r->execute(array($token));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	if (!is_array($row)) {
		error('Во время регистрации произошла ошибка');
	}
	$newUserId = $row['id'];

	if (!$byAdmin && !$byInvitation) {
		
		$teamToken = generateUniqueToken('teams');
		$r = $db->prepare('
			INSERT INTO  
				teams
			VALUES( 
				"", ?, ?
			)
		');
		$r->execute(array($newUserId, $teamToken));

		$r = $db->prepare('
			SELECT 
				id
			FROM 
				teams 
			WHERE 
				token = ?
		');
		$r->execute(array($teamToken));
		$row = $r->fetch(PDO::FETCH_ASSOC);
		if (!is_array($row)) {
			error('Во время регистрации произошла ошибка');
		}
		$newTeamId = $row['id'];

		$r = $db->prepare('
			UPDATE 
				users 
			SET
				team_id = ?
			WHERE 
				token = ?
		');
		$r->execute(array($newTeamId, $token));
	} else if ($role > 2) {
		if (is_array($projects)) {
			$projects = getProjectsIds($projects);
			foreach ($projects as $projectId) {
				$r = $db->prepare('
					INSERT INTO  
						users_projects
					VALUES( 
						"", ?, ?
					)
				');
				$r->execute(array($newUserId, $projectId));
			}
		}
	}
	if (!$byAdmin) {
		createSession($newUserId);
		unknownError();
	}
	success();
}

function getProjectsIds($projects) {
	global $db;
	if (!is_array($projects)) {
		return array();
	}
	$projects = '"'.implode('","', $projects).'"';
	$r = $db->prepare('
		SELECT 
			id
		FROM 
			projects 
		WHERE 
			token 
		IN ('.$projects.')
	');
	$r->execute();
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);
	$ids = array();
	foreach ($rows as $row) {
		$ids[] = $row['id'];
	}
	return $ids;
}

function getInvitaionProjects($token) {
	global $db;
	$r = $db->prepare('
		SELECT 
			p.token
		FROM 
			invitations i
		JOIN 
			invitations_projects ip
			ON i.id = ip.invitation_id
		JOIN 
			projects p 
			ON p.id = ip.project_id
		WHERE 
			i.token = ?
	');
	$r->execute(array($token));
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);
	$projects = array();
	foreach ($rows as $row) {
		$projects[] = $row['token'];
	}
	return $projects;
}

function validateTokenAndRightsToEditUser($user, $action = null) {
	$userToken = $_POST['userToken'];
	if (empty($userToken)) {
		error('Ошибка при действии над пользователем');
	}
	switch ($action) {
		case 'block':
			if ($user['token'] == $userToken || ($user['role'] != 'head' && $user['role'] != 'admin')) {
				noRightsError();
			}
		break;

		default:
			if ($user['token'] != $userToken && $user['role'] != 'head' && $user['role'] != 'admin') {
				noRightsError();
			}
	}	
	return $userToken;
}

function validateProjectToken() {
	$projectToken = $_POST['projectToken'];
	if (empty($projectToken)) {
		error('Ошибка при действии над проектом');
	}
	return $projectToken;
}

function validateTokenAndRightsToEditProject($user, $action = null) {
	$projectToken = validateProjectToken();
	switch ($action) {
		default:
			if ($user['role'] != 'head' && $user['role'] != 'admin' && $user['role'] != 'editor') {
				noRightsError();
			}
	}	
	return $projectToken;
}

function validateInvitationTokenAndRights($user, $role, $token) {
	if (empty($token)) {
		error('Ошибка при действии над приглашением');
	}
	if ($user['role'] != 'head' && $user['role'] != 'admin') {
		noRightsError();
	}
	if ($user['role'] == 'admin' && $role == 2) {
		noRightsError();	
	}
	return $token;
}

function validateLogin($login) {
	if (empty($login)) {
		error('Введите логин');
	}
	if (strlen($login) < 5) {
		error('Логин должен содержать не менее 5-ти символов');
	}
	if (!preg_match('/^[\w]+$/', $login)) {
		$symbols = preg_replace('/[\w]/', '', $login);
		error('Логин содержит некорректные символы: '.$symbols);
	}
	return $login;
}

function validatePassword($password, $password2, $saving = false) {
	if (!$saving && empty($password)) {
		error('Введите пароль');
	}
	if (strlen($password) > 1 && strlen($password) < 5) {
		error('Пароль должен содержать не менее 5-ти символов');
	}	
	if (preg_match('/[а-я]/usi', $password)) {
		$symbols = preg_replace('/[^а-я]/usi', '', $password);
		error('Пароль содержит кириллические символы: '.$symbols);
	}
	if (empty($password2)) {
		if (!$saving || !empty($password)) {
			error('Повторите пароль');
		}
	} elseif ($saving && empty($password)) {
		error('Введите пароль');
	}
	if ($password != $password2) {
		error('Пароли не совпадают');
	}
	return $password;
}

function validateUserName($userName) {
	if (empty($userName)) {
		error('Введите имя пользователя');
	}
	if (!preg_match('/^[a-zа-я ]+$/usi', $userName)) {
		$symbols = preg_replace('/[a-zа-я ]/usi', '', $userName);
		error('Имя содержит некорректные символы: '.$symbols);
	}
	return $userName;
}

function validateEmail($email) {
	if (empty($email)) {
		error('Введите email');
	}
	if (!preg_match('/^[\w]+@[\w]+\.[a-z]{2,10}$/', $email)) {
		error('Введите корректный email');
	}
	return $email;
}

function validateInvitationCode($code) {
	if (strlen($code) > 0 && strlen($code) != 20) {
		error('Некорректный код приглашения');
	}
	return $code;
}

function validateRole($role) {
	if (empty($role)) {
		error('Укажите роль пользователя');
	}
	return $role;
}

function validateSpec($spec, $role) {
	if ($role == 6) {
		if (empty($spec)) {
			error('Укажите специализацию разработчика');
		}
		return $spec;
	} 
	return null;
}

function validateProjects($projects, $role) {
	$projects = json_decode($projects, true);
	if ($role > 2 && empty($projects)) {
		error('Укажите хотя бы один проект');
	}
	return $projects;
}

function validateUniqueness($l, $p, $e, $r) {
	if (is_array($r)) {		
		if ($r['login'] == $l) {
			error('Пользователь с таким логином уже существует');
		}
		if ($r['password'] == $p) {
			error('Пользователь с таким паролем уже существует');
		}
		if ($r['email'] == $e) {
			error('Пользователь с таким email уже существует');
		}
	}
}

function validateTitle($title) {
	if (empty($title)) {
		error('Введите название');
	}
	if (!preg_match('/^[a-zа-я ]+$/usi', $title)) {
		$symbols = preg_replace('/[a-zа-я ]/usi', '', $title);
		error('Название содержит некорректные символы: '.$symbols);
	}
	return $title;
}

function validateHomepage($homepage) {
	if (!empty($homepage) && !preg_match('/https*:\/\/[\w\-\.]{2,}/', $homepage)) {
		error('Введите корректный URL главной страницы');
	}
	return $homepage;
}

function error($error, $errcode = '') {
	die('{"success":false,"error":"'.$error.'","errcode":"'.$errcode.'"}');
}

function unknownError() {
	error('Неизвестная ошибка при обработке запроса');
}

function noRightsError() {
	error('У вас нет прав на данное действие');	
}

function success($params = null) {
	$data = array(
		'success' => true
	);
	if (is_array($params)) {		
		foreach ($params as $k => $v) {
			$data[$k] = $v;
		}
	}
	die(json_encode($data));
}

function getRandomAvatar($teamId) {
	global $db;
	$r = $db->prepare('
		SELECT 
			avatar_id
		FROM 
			users
		WHERE 
			team_id = ?
	');
	$r->execute(array($teamId));
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);
	$ids = array();
	foreach ($rows as $row) {
		$ids[] = (int)$row['avatar_id'];
	}
	$count = 10;
	while (true) {
		$randomId = rand(1, $count);
		if (!in_array($randomId, $ids)) {
			break;
		}
	}
	return $randomId;
}

function getUser($token) {
	global $db;
	$r = $db->prepare('
		SELECT 
			u.id,
			u.name,
			u.token,
			u.team_id,
			u.project_id,
			r.id AS role_id,
			r.code AS role,
			sp.code AS spec,
			p.token AS project,
			p.roots,
			p.nohashes,
			p.noparams,
			p.getparams
		FROM 
			sessions s
		JOIN 
			users u 
			ON u.id = s.user_id
		JOIN 
			roles r 
			ON u.role = r.id 
		LEFT JOIN 
			specs sp 
			ON u.spec = sp.id 
		LEFT JOIN 
			projects p 
			ON u.project_id = p.id 
		WHERE 
			s.token = ?
	');
	$r->execute(array($token));
	return $r->fetch(PDO::FETCH_ASSOC);
}

function getProjects($userId) {
	global $db;
	$r = $db->prepare('
		SELECT 
			p.name,
			p.token
		FROM 
			users_projects up 
		JOIN 
			projects p 
			ON up.project_id = p.id 
		WHERE 
			up.user_id = ?
	');
	$r->execute(array($userId));
	return $r->fetchAll(PDO::FETCH_ASSOC);
}

function getRights($role) {
	global $db;
	$r = $db->prepare('
		SELECT 
			rs.code
		FROM 
			roles r 
		JOIN 
			roles_rights rr 
			ON r.id = rr.role_id
		JOIN 
			rights rs 
			ON rs.id = rr.right_id
		WHERE 
			r.code = ?
	');
	$r->execute(array($role));
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);
	$rights = array();
	foreach ($rows as $r) {
		$rights[] = $r['code'];
	}
	return $rights;
}

function getProject($token) {
	global $db;
	$r = $db->prepare('
		SELECT 
			p.*
		FROM 
			projects p 
		WHERE 
			p.token = ?
	');
	$r->execute(array($token));
	return $r->fetch(PDO::FETCH_ASSOC);
}

function createProject($user) {
	global $db;
	if ($user['role'] != 'head' && $user['role'] != 'admin') {
		noRightsError();
	}

	$userId = $user['id'];
	$name = $_POST['projectName'];
	if (empty($name)) {
		error('Введите название проекта');
	}
	$r = $db->prepare('
		SELECT 
			p.id
		FROM 
			users_projects up 
		JOIN 
			projects p 
			ON up.project_id = p.id 
		WHERE 
			up.user_id = ? 
			AND
			p.name = ?
	');
	$r->execute(array($userId, $name));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	if (is_array($row)) {
		error('У вас уже существует проект с таким названием');
	}

	$token = '';
	while (empty($token)) {
		$token = generateToken();
		$r = $db->prepare('
			SELECT 
				id
			FROM 
				projects
			WHERE 
				token = ?
		');
		$r->execute(array($token));
		$row = $r->fetch(PDO::FETCH_ASSOC);
		if (is_array($row)) {
			$token = '';
		}
	}
	$r = $db->prepare('
		INSERT INTO  
			projects
		VALUES( 
			"", ?, ?
		)
	');
	$r->execute(array($name, $token));
	$r = $db->prepare('
		SELECT 
			id
		FROM 
			projects
		WHERE 
			token = ?
	');
	$r->execute(array($token));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	if (!is_array($row)) {
		error('При создании проекта произошла ошибка');
	}
	$r = $db->prepare('
		INSERT INTO  
			users_projects
		VALUES( 
			"", ?, ?
		)
	');
	$r->execute(array($userId, $row['id']));
	success(array(
		'token' => $token
	));
}

function setCurrentProject($user, $projectToken) {
	global $db;
	$userId = $user['id'];
	$r = $db->prepare('
		SELECT 
			id
		FROM 
			projects
		WHERE 
			token = ?
	');
	$r->execute(array($projectToken));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	if (is_array($row)) {
		$r = $db->prepare('
			UPDATE 
				users
			SET 
				project_id = ?
			WHERE 
				id = ?
		');
		$r->execute(array($row['id'], $userId));
		success();
	}
	error('При смене проекта произошла ошибка: Проект не найден');
}

function getRoles() {
	global $db;
	$r = $db->prepare('
		SELECT 
			r.id,
			r.code,
			GROUP_CONCAT(rs.description ORDER BY rs.id SEPARATOR ";") AS description
		FROM 
			roles r
		JOIN
			roles_rights rr
			ON 
			r.id = rr.role_id
		JOIN
			rights rs
			ON 
			rs.id = rr.right_id
		GROUP BY r.id
	');
	$r->execute();
	$roles = $r->fetchAll(PDO::FETCH_ASSOC);

	$userRoles = array();
	foreach ($roles as $role) {
		$userRoles[] = array(
			'id' => $role['id'],
			'code' => $role['code'],
			'description' => $role['description']
		);
	}
	return $userRoles;
}

function getUsers($user, $refreshing = false) {
	global $db;
	$r = $db->prepare('
		SELECT 
			u.id,
			u.token,
			u.name,
			u2.name AS blockedBy,
			r.code AS role,
			s.code AS spec,
			GROUP_CONCAT(p.name ORDER BY p.id) AS projects
		FROM 
			users u 
		JOIN 
			roles r 
			ON u.role = r.id 
		LEFT JOIN 
			specs s 
			ON u.spec = s.id 
		LEFT JOIN 
			users_projects up 
			ON up.user_id = u.id 
		LEFT JOIN 
			projects p 
			ON up.project_id = p.id 
		LEFT JOIN 
			users u2 
			ON u.blocked_by = u2.id 
		WHERE 
			u.team_id = ?
		GROUP BY u.id
		ORDER BY 
			u.role
	');
	$r->execute(array($user['team_id']));
	$users = $r->fetchAll(PDO::FETCH_ASSOC);

	foreach ($users as &$u) {
		if ($u['role'] == 'head' || $u['role'] == 'admin') {
			$u['projects'] = 'Все проекты';
		}
	}

	if ($refreshing) {
		success(array(
			'users' => $users
		));
	}

	$r = $db->prepare('
		SELECT 
			token
		FROM 
			teams
		WHERE 
			id = ?
	');
	$r->execute(array($user['team_id']));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	$token = $row['token'];

	$r = $db->prepare('SET SESSION group_concat_max_len = 1000000;');
	$r->execute();

	

	$r = $db->prepare('
		SELECT 
			id,
			code
		FROM 
			specs
		ORDER BY id
	');
	$r->execute();
	$specs = $r->fetchAll(PDO::FETCH_ASSOC);
	
	$r = $db->prepare('
		SELECT 
			token,
			name
		FROM 
			projects
		WHERE 
			team_id = ?
			
	');
	$r->execute(array($user['team_id']));
	$projects = $r->fetchAll(PDO::FETCH_ASSOC);

	success(array(
		'users' => $users,
		//'invitations' => getInvitations($user),
		'roles' => getRoles(),
		'specs' => $specs,
		'projects' => $projects
	));
}

function getInvitations($user, $refreshing = false) {
	global $db;
	$r = $db->prepare('
		SELECT 
			i.name,
			i.token,
			r.code
		FROM 
			invitations i
		JOIN
			roles r
		ON 
			i.role_id = r.id
		WHERE 
			i.team_id = ?
	');
	$r->execute(array(
		$user['team_id']
	));
	$invitations = $r->fetchAll(PDO::FETCH_ASSOC);

	if ($refreshing) {
		success(array(
			'invitations' => $invitations
		));
	}
	return $invitations;
}

function getProjectData() {
	global $db;
	$token = $_POST['projectToken'];
	if (empty($token)) {
		error('Во время загрузки проекта возникла ошибка');
	}
	$r = $db->prepare('
		SELECT 
			p.*
		FROM 
			projects p
		WHERE 
			p.token = ?
	');
	$r->execute(array($token));
	$project = $r->fetch(PDO::FETCH_ASSOC);
	success(array(
		'project' => $project,
		'dict' => getDict('projects', $lang)
	));
}

function getUserData() {
	global $db;
	$token = $_POST['userToken'];
	if (empty($token)) {
		error('Во время загрузки пользователя возникла ошибка');
	}
	$r = $db->prepare('
		SELECT 
			u.login,
			u.name AS userName,
			u.email,
			u.role,
			u.spec,
			GROUP_CONCAT(p.token) AS projects
		FROM 
			users u
		LEFT JOIN 
			users_projects up 
			ON up.user_id = u.id 
		LEFT JOIN 
			projects p 
			ON up.project_id = p.id 
		WHERE 
			u.token = ?
		GROUP BY u.id
	');
	$r->execute(array($token));
	$user = $r->fetch(PDO::FETCH_ASSOC);
	if (!is_array($user)) {
		error('Во время загрузки пользователя возникла ошибка');
	}
	$projects = explode(',', $user['projects']);
	$properProjects = array();
	foreach ($projects as $pr) {
		if (!empty($pr)) {
			$properProjects[] = $pr;
		}
	}
	$user['projects'] = $properProjects;
	success(array(
		'user' => $user
	));
}

function getInvitationData() {
	global $db;
	$token = $_POST['invToken'];
	if (empty($token)) {
		error('Во время загрузки приглашения возникла ошибка');
	}
	$r = $db->prepare('
		SELECT 
			i.name AS name,
			i.role_id AS role,
			GROUP_CONCAT(p.token) AS projects
		FROM 
			invitations i
		LEFT JOIN 
			invitations_projects ip 
			ON ip.invitation_id = i.id 
		LEFT JOIN 
			projects p 
			ON ip.project_id = p.id 
		WHERE 
			i.token = ?
		GROUP BY i.id
	');
	$r->execute(array($token));
	$invitation = $r->fetch(PDO::FETCH_ASSOC);

	success(array(
		'invitation' => $invitation
	));
}

function validateProjectAccess($user, $projectToken) {
	global $db;

	$r = $db->prepare('
		SELECT 
			*
		FROM 
			projects
		WHERE 
			token = ? 
		AND
			team_id = ?
	');
	$r->execute(array($projectToken, $user['team_id']));
	$project = $r->fetch(PDO::FETCH_ASSOC);
	if (!is_array($project)) {
		noRightsError();
	}
	return $project;
}

function activateProject($user) {
	global $db;

	$projectToken = validateProjectToken();
	$project = validateProjectAccess($user, $projectToken);
	$r = $db->prepare('
		UPDATE 
			users
		SET
			project_id = ?
		WHERE 
			id = ? 
	');
	$r->execute(array($project['id'], $user['id']));

	success();
}

function requestProjectAccess($user) {
	global $db;

	$projectToken = validateProjectToken();
	$project = validateProjectAccess($user, $projectToken);

	$r = $db->prepare('
		SELECT 
			id
		FROM 
			users_projects
		WHERE 
			project_id = ? 
		AND
			user_id = ?
	');
	$r->execute(array($project['id'], $user['id']));
	$record = $r->fetch(PDO::FETCH_ASSOC);
	if (is_array($record)) {
		error('Вам уже доступен данный проект');
	}
	$insertSQL = 'INSERT INTO access_requests VALUES ("", ?, ?)';
	$r = $db->prepare($insertSQL);
	$r->execute(array($user['id'], $project['id']));
	success(array(
		'message' => 'Запрос на получение доступа к проекту успешно добавлен'
	));
}

function saveProject($user) {
	global $db;
	
	$projectToken = validateTokenAndRightsToEditProject($user);
	validateProjectAccess($user, $projectToken);
	$name  = validateTitle($_POST['name']);

	$r = $db->prepare('
		SELECT 
			id
		FROM 
			projects
		WHERE 
			name = ? 
		AND
			team_id = ?
		AND 
			token != ?
	');
	$r->execute(array($name, $user['team_id'], $projectToken));
	$record = $r->fetch(PDO::FETCH_ASSOC);
	if (is_array($record)) {
		error('Проект с таким именем уже существует');
	}

	$homepage  = validateHomepage($_POST['homepage']);

	$r = $db->prepare('
		UPDATE 
			projects
		SET
			name = ?,
			homepage = ?,
			roots = ?,
			nohashes = ?,
			noparams = ?,
			getparams = ?,
			measure = ?
		WHERE 
			token = ? 
	');
	$r->execute(array(
		$name,
		$homepage,
		$_POST['roots'],
		$_POST['nohashes'],
		$_POST['noparams'],
		$_POST['getparams'],
		$_POST['measure'],
		$projectToken
	));
	success();
}

function saveUser($user) {
	global $db;
	
	$userToken = validateTokenAndRightsToEditUser($user, 'save');	
	$login     = validateLogin($_POST['login']);
	$password  = validatePassword($_POST['password'], $_POST['password2'], true);
	$userName  = validateUserName($_POST['userName']);
	$email     = validateEmail($_POST['email']);
	$role      = validateRole($_POST['role']);
	$spec      = validateSpec($_POST['spec'], $role);
	$projects  = validateProjects($_POST['projects'], $role);

	$r = $db->prepare('
		SELECT 
			* 
		FROM 
			users 
		WHERE 
			token = ?
	');
	$r->execute(array($userToken));
	$row = $r->fetch(PDO::FETCH_ASSOC);

	if (!is_array($row)) {
		error('При сохранении пользователя произошла ошибка');
	}

	$changedParams = array();
	$changedParamValues = array();
	if ($login != $row['login']) {
		$changedParams[] = 'login';
		$changedParamValues['login'] = $login;
	}
	if (!empty($password)) {
		$password = md5($password);
		if ($password != $row['password']) {
			$changedParams[] = 'password';
			$changedParamValues['password'] = $password;
		}
	}
	if ($userName != $row['name']) {
		$changedParams[] = 'name';
		$changedParamValues['name'] = $userName;
	}
	if ($email != $row['email']) {
		$changedParams[] = 'email';
		$changedParamValues['email'] = $email;
	}
	if ($role != $row['role']) {
		$changedParams[] = 'role';
		$changedParamValues['role'] = $role;
	}
	if ($spec != $row['spec']) {
		$changedParams[] = 'spec';
		$changedParamValues['spec'] = $spec;
	}

	$r = $db->prepare('
		SELECT 
			u.id,
			p.token,
			p.id AS pid 
		FROM 
			users u
		LEFT JOIN
			users_projects up
		ON
			u.id = up.user_id
		LEFT JOIN
			projects p
		ON
			p.id = up.project_id
		WHERE 
			u.token = ?
	');
	$r->execute(array($userToken));
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);

	
	$userId = $rows[0]['id'];
	if ($role < 3) {
		$r = $db->prepare('DELETE FROM users_projects WHERE user_id = ?');
		$r->execute(array($userId));
	} else {
		$deleteSQL = 'DELETE FROM users_projects WHERE user_id = ? AND project_id = ?';
		$insertSQL = 'INSERT INTO users_projects VALUES ("", ?, ?)';
		$projectTokens = array();
		$projectsChanged = false;
		foreach ($rows as $pr) {
			if (!empty($pr['token'])) {
				if (!in_array($pr['token'], $projects)) {
					$r = $db->prepare($deleteSQL);
					$r->execute(array($userId, $pr['pid']));
					$projectsChanged = true;
				}
				$projectTokens[] = $pr['token'];
			}
		}
		foreach ($projects as $pr) {
			if (!in_array($pr, $projectTokens)) {
				$r = $db->prepare('SELECT id FROM projects WHERE token = ?');
				$r->execute(array($pr));
				$row = $r->fetch(PDO::FETCH_ASSOC);				
				if (is_array($row)) {
					$projectId = $row['id'];
					$r = $db->prepare($insertSQL);
					$r->execute(array($userId, $projectId));
				}
				$projectsChanged = true;
			}
		}
	}
	

	if (!empty($changedParams)) {
		$where = array();
		$whereParams = array();
		$set = array();
		$setParams = array();
		foreach ($changedParams as $param) {
			$set[] = $param.' = ?';
			$setParams[] = $changedParamValues[$param];
			if ($param == 'name' || $param == 'role' || $param == 'spec') {
				continue;
			}
			$where[] = $param.' = ?';
			$whereParams[] = $changedParamValues[$param];
		}

		if (!empty($whereParams)) {
			$r = $db->prepare('SELECT * FROM users WHERE '.implode(' OR ', $where));
			$r->execute($whereParams);
			$row = $r->fetch(PDO::FETCH_ASSOC);
			validateUniqueness($login, $password, $email, $row);
		}

		$setParams[] = $userToken;
		$r = $db->prepare('UPDATE users SET '.implode(',', $set).' WHERE token = ?');		
		$r->execute($setParams);
	} else if (!$projectsChanged) {
		error('Данные пользователя не поменялись');
	}
	success();
}

function saveInvitation($user) {
	global $db;
	
	$role      = validateRole($_POST['role']);
	$title     = validateTitle($_POST['name']);
	$projects  = validateProjects($_POST['projects'], $role);
	$invToken  = validateInvitationTokenAndRights($user, $role, $_POST['invToken']);	

	$r = $db->prepare('
		UPDATE 
			invitations
		SET
			name = ?, role_id = ?
		WHERE 
			token = ?
	');
	$r->execute(array($title, $role, $invToken));
	success();
}

function blockUser($user) {
	global $db;	
	$userToken = validateTokenAndRightsToEditUser($user, 'block');
	$r = $db->prepare('SELECT blocked_by FROM users WHERE token = ?');
	$r->execute(array($userToken));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	if (!is_array($row)) {
		unknownError();	
	}
	$isBlocked = $row['blocked_by'] != null;
	$blockedBy = $isBlocked ? null : $user['id'];
	$r = $db->prepare('
		UPDATE 
			users
		SET 
			blocked_by = ?
		WHERE 
			token = ?
	');
	$r->execute(array($blockedBy, $userToken));
	success();
}

function loadUser($user) {
	$projects = getProjects($user['id']);
	$data = array(
		'user' => $user,
		'rights' => getRights($user['role'])
	);
	if (count($projects) > 0) {
		if (!empty($user['project'])) {
			$currentProjectToken = $user['project'];
			$data['project'] = getProject($user['project']);
		}
		if (empty($data['project'])) {
			$currentProjectToken = $projects[0]['token'];
			$data['project'] = getProject($projects[0]['token']);
		}		
		$properProjects = array();
		foreach ($projects as $project) {
			$properProjects[] = $project['token'];
		}
		$data['projects'] = $properProjects;		
	}
	$data['tasks_count'] = getTasksCounts($user);
	success($data);
}

function getTasksCounts($user) {
	global $db;
	$counts = array();
	if ($user['role_id'] > 1) {
		$r = $db->prepare('
			SELECT COUNT(id) AS count FROM tasks_users WHERE user_id = ?
		');
		$r->execute(array($user['id']));
		$row = $r->fetch(PDO::FETCH_ASSOC);
		$counts['forme'] = (int)$row['count'];
	} else {
		$counts['forme'] = 0;
	}

	if ($user['role_id'] < 6) {
		$r = $db->prepare('
			SELECT COUNT(id) AS count FROM tasks WHERE user_id = ?
		');
		$r->execute(array($user['id']));
		$row = $r->fetch(PDO::FETCH_ASSOC);
		$counts['fromme'] = (int)$row['count'];
	} else {
		$counts['fromme'] = 0;
	}
	$r = $db->prepare('
		SELECT COUNT(id) AS count FROM tasks WHERE team_id = ? AND project_id = ? AND min_role >= ?
	');
	$r->execute(array($user['team_id'], $user['project_id'], $user['role_id']));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	$counts['all'] = (int)$row['count'];
				
	return $counts;
}

function createInvitation($user) {
	global $db;
	
	$title = validateTitle($_POST['name']);
	$role = validateRole($_POST['role']);
	$projects = validateProjects($_POST['projects'], $role);
	$token = generateUniqueToken('invitations');
	validateInvitationTokenAndRights($user, $role, $token);
	
	$r = $db->prepare('
		INSERT INTO
			invitations
		VALUES ("", ?, ?, ?, ?)
	');
	$r->execute(array($user['team_id'], $title, $token, $role));
	$r = $db->prepare('
		SELECT 
			id
		FROM 
			invitations
		WHERE 
			token = ?
	');
	$r->execute(array($token));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	if (!is_array($row)) {
		unknownError();
	}
	$projects = getProjectsIds($projects);
	foreach ($projects as $projectId) {
		$r = $db->prepare('
			INSERT INTO
				invitations_projects
			VALUES ("", ?, ?)
		');
		$r->execute(array($row['id'], $projectId));
	}
	success();
}

function logout($token) {
	global $db;
	$r = $db->prepare('
		DELETE FROM
			sessions
		WHERE 
			token = ?
	');
	$r->execute(array($token));
	success();
}

function loadProjects($user) {
	global $db;
	$r = $db->prepare('
		SELECT 
			GROUP_CONCAT(u.role) AS roles,
			p.id,
			p.name,
			p.token,
			p.homepage,
			IF(ar.id IS NOT NULL , 1, 0) AS requested
		FROM 
			users u
		JOIN 
			users_projects up 
			ON up.user_id = u.id
		JOIN 
			projects p 
			ON up.project_id = p.id
		LEFT JOIN 
			access_requests ar 
			ON ar.project_id = p.id
		WHERE 
			u.team_id = ?
		GROUP BY
			p.token
	');
	$r->execute(array($user['team_id']));
	$projects = $r->fetchAll(PDO::FETCH_ASSOC);

	foreach ($projects as &$project) {
		if ($project['id'] == $user['project_id']) {
			$project['current'] = true;
		}
		if (!empty($project['roles'])) {
			$roles = explode(',', $project['roles']);
			$project['users_count'] = count($roles);
		} else {
			$project['users_count'] = 0;
		}
		unset($project['id'], $project['roles']);
	}

	success(array(
		'projects' => $projects
	));
}

function saveTask($user) {
	global $db;
	$data = json_decode($_POST['data'], true);
	if (!is_array($data)) {
		unknownError();
	}
	extract($data);
	if (is_array($formData)) {
		extract($formData);
	}
	if (empty($title)) {
		error('Введите заголовок задачи');
	}
	if (!is_array($urls)) {
		unknownError();
	}
	$properUrls = array();
	foreach ($urls as $url) {
		$url = preg_replace('/\s/', '', $url);
		if (!empty($url)) {
			$properUrls[] = $url;
		}
	}
	if (empty($properUrls)) {
		error('Не найдено ни одного пути к задаче');
	}
	if (empty($type)) {
		error('Укажите категорию задачи');
	}
	if (empty($action)) {
		error('Укажите действие задачи');
	}
	if (!is_array($execs) || empty($execs)) {
		$users = getExecutors($user, $type, $action);
		if (empty($users['proper'])) {
			error('Назначьте исполнителей задачи');		
		}
		$execs = array();
		foreach ($users['proper'] as $u) {
			$execs[] = $u['token'];
		}
	}
	$data = array(
		'title' => $title,
		'descr' => $description,
		'urls' => $properUrls
	);
	$data = json_encode($data);
	$taskToken = generateToken(6);

	$tokens = '"'.implode('","', $execs).'"';
	$r = $db->prepare('SELECT id, role FROM users WHERE token IN ('.$tokens.')');
	$r->execute();
	$userRows = $r->fetchAll(PDO::FETCH_ASSOC);

	$minRole = 0;
	$changed = strtotime('now');
	foreach ($userRows as $row) {
		if ($row['role'] > $minRole) {
			$minRole = $row['role'];
		}
	}

	$r = $db->prepare('
		INSERT INTO
			tasks
		VALUES (
			"",
			?,
			?,
			?,
			(SELECT id FROM task_types WHERE code = ?),
			(SELECT id FROM task_actions WHERE code = ?),
			(SELECT id FROM task_importance WHERE code = ?),
			?,
			?,
			null,
			?,
			?
		)
	');
	$r->execute(array(
		$user['team_id'],
		$user['id'],
		$user['project_id'],
		$type,
		$action,
		$importance,
		$data,
		$taskToken,
		$minRole,
		$changed
	));

	$r = $db->prepare('
		SELECT 
			id
		FROM 
			tasks
		WHERE 
			token = ?
		AND 
			user_id = ?
		ORDER BY 
			id DESC
		LIMIT 1
	');
	$r->execute(array($taskToken, $user['id']));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	if (!is_array($row)) {
		unknownError();	
	}
	$taskId = $row['id'];
	$r = $db->prepare('INSERT INTO tasks_users VALUES ("", ?, ?, ?)');
	foreach ($userRows as $row) {
		$r->execute(array($taskId, $row['id'], $user['project_id']));
	}



	success(array(
		'message' => 'Задача успешно добавлена'
	));
}

function getTooltip() {
	$name = $_POST['name'];
	$tooltip = getHelp($name);

	if (!is_array($tooltip)) {
		error('Подсказка не найдена');
	}
	success(array('tooltip' => $tooltip));
}

function loadUrlDialog() {
	global $lang;
	success(array(
		'dict' => getDict('url_dialog', $lang)
	));
}

function loadInfoDialog() {
	global $lang;
	success(array(
		'dict' => getDict('info_dialog', $lang)
	));
}

function getExecutors($user, $taskType, $taskAction) {
	global $db;
	$r = $db->prepare('
		SELECT 
			u.token,
			u.name,
			r.code AS role,
			s.code AS spec
		FROM 
			users u
		LEFT JOIN 
			roles r
			ON r.id = u.role
		LEFT JOIN 
			specs s
			ON s.id = u.spec
		WHERE 
			u.team_id = ?
		AND 
			u.role > ?
		AND 
		 	u.role != 7
		AND 
			u.blocked_by IS NULL
		ORDER BY 
			u.role ASC
	');
	$r->execute(array($user['team_id'], $user['role_id']));
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);
	$proper = array();
	$rest = array();
	foreach ($rows as $row) {
		if  ($taskAction == 'planning') {
			if ($row['role'] == 'admin' || $row['role'] == 'editor' || $row['role'] == 'analyst') {
				$proper[] = $row;
				continue;
			}
		} elseif  ($taskType == 'design') {
			if ($row['spec'] == 'designer') {
				$proper[] = $row;
				continue;
			}
		} elseif  ($taskType == 'prototype') {
			if ($row['role'] == 'editor' || $row['role'] == 'analyst') {
				$proper[] = $row;
				continue;
			}
		} elseif  ($taskType == 'text') {
			if ($taskAction == 'developing') {
				if ($row['role'] == 'editor' || $row['role'] == 'analyst') {
					$proper[] = $row;
					continue;
				}
			} elseif ($row['spec'] == 'frontend' || $row['spec'] == 'htmler' || $row['spec'] == 'fullstack') {
				$proper[] = $row;
				continue;
			}
		} elseif  ($taskType == 'html' || $taskType == 'style' || $taskType == 'page') {
			if ($row['spec'] == 'frontend' || $row['spec'] == 'htmler' || $row['spec'] == 'fullstack') {
				$proper[] = $row;
				continue;
			}
		} elseif  ($taskType == 'frontend') {
			if ($row['spec'] == 'frontend' || $row['spec'] == 'fullstack') {
				$proper[] = $row;
				continue;
			}
		} elseif  ($taskType == 'backend') {
			if ($row['spec'] == 'backend' || $row['spec'] == 'fullstack') {
				$proper[] = $row;
				continue;
			}
		} elseif  ($taskType == 'test') {
			if ($row['role'] == 'tester') {
				$proper[] = $row;
				continue;
			}
		} elseif  ($taskType == 'project') {
			if ($row['role'] == 'admin' || $row['role'] == 'editor' || $row['role'] == 'analyst') {
				$proper[] = $row;
				continue;
			}
		}
		$rest[] = $row;
	}
	
	return array(
		'proper' => $proper,
		'rest' => $rest
	);
}

function loadTaskUsers($user) {
	global $lang;
	$dict = getDict('task_users_dialog', $lang);
	$dict['users'] = getExecutors($user, $_POST['type'], $_POST['action']);
	success(array(
		'dict' => $dict
	));
}

function loadTaskInfo($user) {
	global $db;
	$id = $_POST['id'];
	$r = $db->prepare('
		SELECT 
			id,
			blocked_by 
		FROM 
			users 
		WHERE 
			login = ? and password = ?
	');
	$r->execute(array($login, $password));
	$user = $r->fetch(PDO::FETCH_ASSOC);
}

function loadTaskActions($user) {
	global $db;
	$id = $_POST['id'];
	$r = $db->prepare('
		SELECT 
			t.*
		FROM 
			tasks t
		WHERE 
			t.id = ?
		AND 
			t.team_id = ?
	');
	$r->execute(array($id, $user['team_id']));
	$task = $r->fetch(PDO::FETCH_ASSOC);
	$changedBy = $task['changed_by'];
	$status = $task['status_id'];

	if (!is_array($task)) {
		error('Задача не найдена или у вас нет на нее прав');
	}

	$r = $db->prepare('
		SELECT 
			tu.id
		FROM 
			tasks_users tu
		WHERE 
			tu.task_id = ?
		AND 
			tu.user_id = ?
	');
	$r->execute(array($id, $user['id']));
	$taskUser = $r->fetch(PDO::FETCH_ASSOC);
	
	$isUserTask = is_array($taskUser) && ($changedBy == $user['id'] || empty($status));
	$actions = array();
	if ($isUserTask) {
		// in_work
		if ($status == 6) {
			$actions[] = 'complete';
			$actions[] = 'delay';
			$actions[] = 'refuse';
			$actions[] = 'problem';
		}
		// none
		elseif (empty($status)) {
			$actions[] = 'take';
			$actions[] = 'problem';
		}
		// ready
		elseif ($status == 1) {
			$actions[] = 'resume';
		}
		// delayed
		elseif ($status == 5) {
			$actions[] = 'continue';
			$actions[] = 'refuse';
			$actions[] = 'problem';
		}
		
	}
	if ($user['id'] == $task['user_id']) {
		//$actions[] = 'hand';
		$actions[] = 'assign';
		$actions[] = 'comment';
		 
		// ready
		if ($status == 1) {
			$actions[] = 'open';
			$actions[] = 'close';
		} else {
			$actions[] = 'remove';
		}
		if (empty($status) || $status == 5) {
			$actions[] = 'freeze';	
		}
	}
	$data = array(
		'actions' => $actions,
		'dict' => getDict('task_actions')
	);
	success($data);
}

function loadTasks($user) {
	global $db;
	$filter = $_POST['filter'];
	$status = $_POST['status'];
	$type = $_POST['type'];
	$importance = $_POST['importance'];

	if (empty($filter)) {
		$filter = 'fromme';
		switch ($user['role']) {
			case 'developer':
			case 'tester':
				$filter = 'forme';
			break;

			case 'observer':
				$filter = 'all';
			break;
		}
	}

	$sqlStatus = '(t.status_id < 8 OR t.status_id IS NULL)';
	switch ($status) { 
		case 'ready':
			$sqlStatus = 't.status_id = 1';
		break;
		case 'in_work':
			$sqlStatus = 't.status_id = 6';
		break;
		case 'cant_do':
			$sqlStatus = 't.status_id = 7';
		break;
		case 'delayed':
			$sqlStatus = 't.status_id = 5';
		break;
		case 'none':
			$sqlStatus = 't.status_id IS NULL';
		break;
	}

	
	$sqlParams = array(
		$user['id'],
		$user['project_id'],
		$user['role_id']
	);
	$typeSql = '';
	if (!empty($type)) {
		$typeSql = ' AND type_id = (SELECT id FROM task_types WHERE code = ?) ';
		$sqlParams[] = $type;
	}
	$impSql = '';
	if (!empty($importance)) {
		$impSql = ' AND importance_id = (SELECT id FROM task_importance WHERE code = ?) ';
		$sqlParams[] = $importance;
	}

	if ($user['role_id'] < 4) {
		$user['role_id'] = 0;
	}

	switch ($filter) {
		case 'fromme':
			$r = $db->prepare('
				SELECT 
					t.*,
					tt.code AS type,
					ta.code AS action,
					ti.code AS importance,
					ts.code AS status,
					u.name AS user_name,
					u.avatar_id,
					u2.name AS user_name2,
					u2.avatar_id AS avatar_id2
					
				FROM tasks t

				JOIN task_types tt
					ON tt.id = t.type_id
				JOIN task_actions ta
					ON ta.id = t.action_id
				JOIN task_importance ti
					ON ti.id = t.importance_id
				LEFT JOIN task_statuses ts
					ON ts.id = t.status_id
				JOIN users u
					ON t.user_id = u.id
				LEFT JOIN users u2
					ON t.changed_by = u2.id
				WHERE 
					t.user_id = ?
				AND
					t.project_id = ?
				AND 
					t.min_role >= ?
				AND 
					'.$sqlStatus.'
					'.$typeSql.'
					'.$impSql.'
				ORDER BY 
					ti.code ASC
			');
			$r->execute($sqlParams);

		break;

		case 'forme':
			$r = $db->prepare('
				SELECT 
					t.*,
					tt.code AS type,
					ta.code AS action,
					ti.code AS importance,
					ts.code AS status,
					u.name AS user_name,
					u.avatar_id,
					u2.name AS user_name2,
					u2.avatar_id AS avatar_id2
					
				FROM 
					tasks_users tu
				JOIN tasks t
					ON t.id = tu.task_id
				JOIN task_types tt
					ON tt.id = t.type_id
				JOIN task_actions ta
					ON ta.id = t.action_id
				JOIN task_importance ti
					ON ti.id = t.importance_id
				LEFT JOIN task_statuses ts
					ON ts.id = t.status_id
				JOIN users u
					ON t.user_id = u.id
				LEFT JOIN users u2
					ON t.changed_by = u2.id
				WHERE 
					tu.user_id = ?
				AND
					tu.project_id = ?
				AND 
					t.min_role >= ?
				AND 
					'.$sqlStatus.'
					'.$typeSql.'
					'.$impSql.'
				ORDER BY 
					ti.code ASC
			');
			$r->execute($sqlParams);

		break;
		
		default:
			$r = $db->prepare('
				SELECT 
					t.*,
					tt.code AS type,
					ta.code AS action,
					ti.code AS importance,
					ts.code AS status,
					u.name AS user_name,
					u.avatar_id,
					u2.name AS user_name2,
					u2.avatar_id AS avatar_id2
				FROM 
					tasks t
				JOIN task_types tt
					ON tt.id = t.type_id
				JOIN task_actions ta
					ON ta.id = t.action_id
				JOIN task_importance ti
					ON ti.id = t.importance_id
				LEFT JOIN task_statuses ts
					ON ts.id = t.status_id
				JOIN users u
					ON t.user_id = u.id
				LEFT JOIN users u2
					ON t.changed_by = u2.id
				WHERE 
					t.team_id = ?
				AND
					t.project_id = ?
				AND 
					t.min_role >= ?
				AND 
					'.$sqlStatus.'
					'.$typeSql.'
					'.$impSql.'
				ORDER BY 
					ti.code ASC
			');
			$r->execute($sqlParams);
	}
	
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);  
	$tasks = array();
	if ($user['role_id'] < 5) {
		$byStatus = array(
			'cant_do' => array(),
			'ready' => array(),
			'in_work' => array(),
			'rest' => array()
		);
	} else {
		$byStatus = array(
			'current' => array(),
			'in_work' => array(),
			'ready' => array(),
			'cant_do' => array(),			
			'rest' => array()
		);
	}
	$dict = getDict('task');
	foreach ($rows as $row) {
		if (!empty($row['user_name2'])) {
			$row['user_name'] = $row['user_name2'];
			$row['avatar_id'] = $row['avatar_id2'];
			unset($row['user_name2'], $row['avatar_id2']);
		}
		if (empty($row['status'])) {
			$row['status'] = 'current';
		}
		$row['changed'] = $dict[$row['status']].' '.getFormattedDate($row['changed'], $row['status'] != 'in_work');
		$row['data'] = json_decode($row['data'], true);
		if (is_array($byStatus['current']) && $row['status'] == 'current') {
			$byStatus['current'][] = $row;
		} else if (!empty($row['status'])) {
			$byStatus[$row['status']][] = $row;
		} else {
			$byStatus['rest'][] = $row;
		}
	}
	foreach ($byStatus as $v) {
		$tasks = array_merge($tasks, $v);
	}
	success(array(
		'tasks' => $tasks,
		'dict' => $dict
	));
}

function getFormattedDate( $date, $ago = false ) {
	$dict = getDict('time'); 
    $stf      = 0;
    $cur_time = time();
    $diff     = $cur_time - $date;
 
    $seconds = array( $dict['second'], $dict['seconds'], $dict['seconds2'] );
    $minutes = array( $dict['minute'], $dict['minutes'], $dict['minutes2'] );
    $hours   = array( $dict['hour'], $dict['hours'], $dict['hours2'] );
    $days    = array( $dict['day'], $dict['days'], $dict['days2'] );
    $weeks   = array( $dict['week'], $dict['weeks'], $dict['weeks2'] );
    $months  = array( $dict['month'], $dict['months'], $dict['months2'] );
    $years   = array( $dict['year'], $dict['years'], $dict['years2'] );
    $decades = array( $dict['decade'], $dict['decades'], $dict['decades2'] );
 
    $phrase = array( $seconds, $minutes, $hours, $days, $weeks, $months, $years, $decades );
    $length = array( 1, 60, 3600, 86400, 604800, 2630880, 31570560, 315705600 );
 
    for ( $i = sizeof( $length ) - 1; ( $i >= 0 ) && ( ( $no = $diff / $length[ $i ] ) <= 1 ); $i -- ) {
        ;
    }
    if ( $i < 0 ) {
        $i = 0;
    }
    $_time = $cur_time - ( $diff % $length[ $i ] );
    $no    = floor( $no );
    $value = sprintf( "%d %s ", $no, getPhrase( $no, $phrase[ $i ] ) );
 
    if ( ( $stf == 1 ) && ( $i >= 1 ) && ( ( $cur_time - $_time ) > 0 ) ) {
        $value .= time_ago( $_time );
    }
 
    return $value . ( $ago === true ? ' '.$dict['ago'] : '');
}
 
function getPhrase( $number, $titles ) {
    $cases = array( 2, 0, 1, 1, 1, 2 );
 
    return $titles[ ( $number % 100 > 4 && $number % 100 < 20 ) ? 2 : $cases[ min( $number % 10, 5 ) ] ];
}

function generateUniqueToken($tableName) {
	global $db;
	$token = '';
	while (empty($token)) {
		$token = generateToken();
		$r = $db->prepare('
			SELECT 
				id
			FROM 
				'.$tableName.'
			WHERE 
				token = ?
		');
		$r->execute(array($token));
		$row = $r->fetch(PDO::FETCH_ASSOC);
		if (is_array($row)) {
			$token = '';
		} else {
			return $token;
		}
	}
}

function generateToken($length = 20) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$action = $_GET['action'];
$token = $_GET['token'];
$lang = $_GET['lang'];

if ($action == 'dictionary') {
	include 'dictionary/index.php';
}

if (!empty($token)) {
	$user = getUser($token);
	if (is_array($user)) {
		switch ($action) {
			case 'get_tooltip':
				getTooltip();
			break;

			case 'load_url_dialog':
				loadUrlDialog();
			break;

			case 'load_info_dialog':
				loadInfoDialog();
			break;

			case 'set_project':
				setCurrentProject($user, $_POST['project']);
			break;

			case 'load_user':
				loadUser($user);
			break;

			case 'logout':
				logout($token);
			break;

			case 'create_project':
				createProject($user);
			break;

			case 'load_users':
				getUsers($user);
			break;

			case 'refresh_users':
				getUsers($user, true);
			break;

			case 'save_user':
				saveUser($user);
			break;

			case 'block_user':
				blockUser($user);
			break;

			case 'create_user':
				register($user);
			break;

			case 'get_user_data':
				getUserData();
			break;

			case 'create_invitation':
				createInvitation($user);
			break;

			case 'refresh_invitations':
				getInvitations($user, true);
			break;

			case 'get_invitation_data':
				getInvitationData();
			break;

			case 'save_invitation':
				saveInvitation($user);
			break;

			case 'load_projects':
				loadProjects($user);
			break;

			case 'get_project_data':
				getProjectData();
			break;

			case 'save_project':
				saveProject($user);
			break;

			case 'request_project_access':
				requestProjectAccess($user);
			break;

			case 'activate_project':
				activateProject($user);
			break;

			case 'save_task':
				saveTask($user);
			break;

			case 'load_task_users':
				loadTaskUsers($user);
			break;

			case 'load_tasks':
				loadTasks($user);
			break;

			case 'load_task_info':
				loadTaskInfo($user);
			break;

			case 'load_task_actions':
				loadTaskActions($user);
			break;

		}
	} else {
		error('По текущему токену сессии пользователь не найден, авторизуйтесь заново', 'invalid_token');
	}
} else {
	if (isset($_POST['login'])) {
		if ($action == 'auth') {
			auth();
		} elseif ($action == 'register') {
			register();
		}
	}
}
unknownError();