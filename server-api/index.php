<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
}

mb_internal_encoding("UTF-8");

include 'db.php';
$db = DB::getDb();

function mb_lcfirst($text) {
    return mb_strtolower(mb_substr($text, 0, 1)) . mb_substr($text, 1);
}

function requireClasses() {
	$names = func_get_args();
	foreach ($names as $name) {
		$path = __DIR__.'/classes/'.$name.'.php';
		if (file_exists($path)) {
			require_once $path;
		}
	}
}

function getLang($language = null) {
	if (empty($language)) {
		$language = $_GET['lang'];
	}
	if (empty($language)) {
		$language = 'ru';
	}
	return $language;
}

function getDict($names, $language = null) {
	$language = getLang($language);
	$dicts = array();
	if (!is_array($names)) {
		$names = array($names);
	}
	foreach ($names as $name) {
		$path = './dictionary/'.$name.'.php';
		if (file_exists($path)) {
			include $path;
			if (is_array($dict)) {
				$dicts = array_merge($dicts, $dict);
			}
		}
	}
	return $dicts;
}

function getHelp($name, $language = null) {
	if (empty($language)) {
		$language = $_GET['lang'];
	}
	if (empty($language)) {
		$language = 'ru';
	}
	$path = './dictionary/help/'.$name.'.php';
	if (file_exists($path)) {
		include $path;
		if (is_array($help)) {
			return array($name => $help);
		}
	}
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

function validateTokenAndRightsToEditUser($user, $action = null) {
	$userToken = $_REQUEST['userToken'];
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
	$projectToken = $_REQUEST['projectToken'];
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

function success($params = null, $message = null) {
	$data = array(
		'success' => true,
		'body' => array()
	);
	if (is_string($message) && !empty($message)) {
		$data['message'] = $message;
	}
	if (is_array($params)) {		
		foreach ($params as $k => $v) {
			$data['body'][$k] = $v;
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

function createProject($user) {
	global $db;
	if ($user['role'] != 'head' && $user['role'] != 'admin') {
		noRightsError();
	}

	$userId = $user['id'];
	$name = $_REQUEST['projectName'];
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

function setCurrentProject($user) {
	global $db;
	$projectId = $_REQUEST['id'];
	$userId = $user['id'];
	$r = $db->prepare('
		SELECT 
			p.*,
			pc.value AS color
		FROM 
			projects p
		LEFT JOIN 
			project_colors pc
			ON p.color_id = pc.id
		WHERE 
			p.id = ?
	');
	$r->execute(array($projectId));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	if (is_array($row)) {
		$teamId = $row['team_id'];
		if ($teamId != $user['team_id']) {
			noRightsError();
		}
		$r = $db->prepare('
			UPDATE 
				users
			SET 
				project_id = ?
			WHERE 
				id = ?
		');
		$r->execute(array($projectId, $userId));
		success(
			array(
				'project' => array(
					'id' => $row['id'],
					'name' => $row['name'],
					'color' => $row['color'],
					'token' => $row['token']
				)
			)
		);
	}
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

	$r = $db->prepare('SET SESSION group_concat_max_len = 1000000;');
	$r->execute();
	
	$typeFilter = $_REQUEST['typeFilter'];
	$statusFilter = $_REQUEST['statusFilter'];
	$projectFilter = $_REQUEST['projectFilter'];

	$typeCondition = '';
	$statusCondition = '';
	$projectCondition = '';

	if (!empty($typeFilter)) {
		if ($typeFilter == 'admins') {
			$typeCondition = ' AND u.role < 5 ';
		} else {
			$typeCondition = ' AND u.role > 4 ';
		}
	}
	if (!empty($statusFilter)) {
		if ($statusFilter == 'busy') {
			$statusCondition = ' AND t.title IS NOT NULL ';
		} else {
			$statusCondition = ' AND t.title IS NULL ';
		}
	}
	if (!empty($projectFilter)) {
		$projectCondition = ' AND u.project_id = '.$user['project_id'];
	}
	$dict = getDict('work_statuses');
	$r = $db->prepare('
		SELECT 
			u.id,
			u.avatar_id,
			u.token,
			pr.name AS project_name,
			u.name,
			u2.name AS blockedBy,
			r.code AS role,
			s.code AS spec,
			t.title AS task,
			ws.work_status_id,
			GROUP_CONCAT(p.name ORDER BY p.id) AS projects
		FROM 
			users u 
		LEFT JOIN 
			projects pr 
			ON u.project_id = pr.id 
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
			tasks t
			ON t.changed_by = u.id AND t.status_id = 2
		LEFT JOIN 
			projects p 
			ON up.project_id = p.id 
		LEFT JOIN 
			users u2 
			ON u.blocked_by = u2.id 
		LEFT JOIN 
			user_work_statuses ws 
			ON ws.user_id = u.id 
		WHERE 
			u.team_id = ?
			'.$typeCondition.'
			'.$statusCondition.'
			'.$projectCondition.'
		GROUP BY u.id
		ORDER BY 
			u.role
	');
	$r->execute(array($user['team_id']));
	$users = $r->fetchAll(PDO::FETCH_ASSOC);

	foreach ($users as &$u) {
		if (empty($u['work_status_id'])) {
			$u['work_status_id'] = 2;
		}
		$u['status'] = $dict['statuses'][$u['work_status_id']];
		if ($u['role'] == 'head' || $u['role'] == 'admin') {
			$u['projects'] = '*';
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


	$r = $db->prepare('
		SELECT 
			id,
			for_user,
			changed_by,
			status_id
		FROM 
			tasks
		WHERE 
			team_id = ?
		 AND ( 
		 	status_id IS NULL 
		 OR 
		 	status_id = 2
		 OR 
		 	status_id = 3
		)
	');
	$r->execute(array($user['team_id']));
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);
	$counts = array();
	$tasks = array();
	foreach ($rows as $r) {
		$uid = 0;
		if (!empty($r['for_user'])) {
			$uid = $r['for_user'];
		} elseif (!empty($r['changed_by'])) {
			$uid = $r['changed_by'];
		} elseif (empty($r['status_id'])) {
			$tasks[] = $r['id'];
		}
		if (!empty($uid)) {
			if (!is_array($counts[$uid])) {
				$counts[$uid] = array('own' => 0);
			}
			$counts[$uid]['own']++;
		}
	}

	$r = $db->prepare('
		SELECT 
			task_id,
			user_id
		FROM 
			tasks_users
		WHERE 
			team_id = ?
	');
	$r->execute(array($user['team_id']));
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);
	foreach ($rows as $r) {
		if (in_array($r['task_id'], $tasks)) {
			if (!is_array($counts[$r['user_id']])) {
				$counts[$r['user_id']] = array('available' => 0);
			} else {
				$counts[$r['user_id']]['available'] = 0;
			}
			$counts[$r['user_id']]['available']++;
		}
	}

	foreach ($users as &$u) {
		if (is_array($counts[$u['id']])) {			
			if (!isset($counts[$u['id']]['own'])) {
				$counts[$u['id']]['own'] = 0;
			}
			if (!isset($counts[$u['id']]['available'])) {
				$counts[$u['id']]['available'] = 0;
			}
			$u['task_counts'] =  $counts[$u['id']];
		} else {
			$u['task_counts'] = array('own' => 0, 'available' => 0);
		}
	}

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
	$token = $_REQUEST['projectToken'];
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
		'dict' => getDict('projects')
	));
}

function getUserData() {
	global $db;
	$token = $_REQUEST['userToken'];
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
	$token = $_REQUEST['invToken'];
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
	success(
		null,
		'Запрос на получение доступа к проекту успешно добавлен'
	);
}

function saveProject($user) {
	global $db;
	$roots = $_REQUEST['roots'];
	
	$rootsArr = preg_split('/,|[\r\n]{1,}/', $roots);
	foreach ($rootsArr as $url) {
		$url = preg_replace('/\s/', '', $url);
		if (empty($url)) {
			continue;
		}
		$origUrl = $url;
		if (!preg_match('/^https*:\/\//', $url)) {
			error('Адреса корневых директорий должны начинаться с http(s)://');
		}
		$url = preg_replace('/^https*:\/\//', '', $url);
		if (!preg_match('/^\w/', $url) && !preg_match('/^\*\.\w/i', $url)) {
			error('Адрес корневой директории \"'.$origUrl.'\" не корректен');
		}
	}
	
	$projectToken = validateTokenAndRightsToEditProject($user);
	validateProjectAccess($user, $projectToken);
	$name  = validateTitle($_REQUEST['name']);

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

	$homepage  = validateHomepage($_REQUEST['homepage']);

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
		$_REQUEST['roots'],
		$_REQUEST['nohashes'],
		$_REQUEST['noparams'],
		$_REQUEST['getparams'],
		$_REQUEST['measure'],
		$projectToken
	));
	success();
}

function saveUser($user) {
	global $db;
	
	$userToken = validateTokenAndRightsToEditUser($user, 'save');	
	$login     = validateLogin($_REQUEST['login']);
	$password  = validatePassword($_REQUEST['password'], $_REQUEST['password2'], true);
	$userName  = validateUserName($_REQUEST['userName']);
	$email     = validateEmail($_REQUEST['email']);
	$role      = validateRole($_REQUEST['role']);
	$spec      = validateSpec($_REQUEST['spec'], $role);
	$projects  = validateProjects($_REQUEST['projects'], $role);

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
	
	$role      = validateRole($_REQUEST['role']);
	$title     = validateTitle($_REQUEST['name']);
	$projects  = validateProjects($_REQUEST['projects'], $role);
	$invToken  = validateInvitationTokenAndRights($user, $role, $_REQUEST['invToken']);	

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

function createInvitation($user) {
	global $db;
	
	$title = validateTitle($_REQUEST['name']);
	$role = validateRole($_REQUEST['role']);
	$projects = validateProjects($_REQUEST['projects'], $role);
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

function loadProjectsList($user) {
	global $db;
	$r = $db->prepare('SELECT id, name FROM projects WHERE team_id = ?');
	$r->execute(array($user['team_id']));
	$projects = $r->fetchAll(PDO::FETCH_ASSOC);
	foreach ($projects as &$p) {
		if ($p['id'] == $user['project_id']) {
			$p['current'] = true;
		}
	}
	success(array(
		'projectsList' => $projects
	));
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
	$data = json_decode($_REQUEST['data'], true);
	if (!is_array($data)) {
		unknownError();
	}
	extract($data);
	$isEditing = !empty($task_id);
	$noExecs = false;
	if ($isEditing) {
		$r = $db->prepare('
			SELECT 
				status_id
			FROM 
				tasks
			WHERE 
				id = ?
		');
		$r->execute(array($task_id));
		$row = $r->fetch(PDO::FETCH_ASSOC);
		if ($row['status_id'] == 2 || $row['status_id'] == 3) {
			$noExecs = true;
		}
	}
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
	if (!$noExecs) {
		if (empty($type)) {
			error('Укажите категорию задачи');
		}
		if (empty($action)) {
			error('Укажите действие задачи');
		}
		if (empty($difficulty)) {
			error('Укажите предполагаемую сложность задачи');
		}
		if (empty($termsId)) {
			error('Укажите предполагаемый срок выполнения задачи');
		}
		if (empty($until)) {
			error('Укажите к какому времени задача должна быть выполнена');
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
	}
	$properInfo = array();
	if (is_array($info)) {		
		foreach ($info as $k => $item) {
			if (preg_replace('/\s/', '', $item) != '') {
				$properInfo[$k] = $item;
			}
		}
	}
	if (!is_array($taskList)) {
		$taskList = array();
	}
	$properTaskList = array();
	foreach ($taskList as $item) {
		if (!empty($item)) {
			$properTaskList[] = $item;
		}
	}
	$data = array(
		'descr' => $description,
		'urls' => $properUrls,
		'info' => $properInfo,
		'elements' => $visualElements,
		'bent' => $bent,
		'nohashes' => $nohashes,
		'noparams' => $noparams,
		'markElement' => $markElement,
		'selectionElement' => $selectionElement,
		'taskList' => $properTaskList
	);
	$data = json_encode($data, JSON_UNESCAPED_UNICODE);


	if (!$noExecs) {
		$tokens = '"'.implode('","', $execs).'"';
		$r = $db->prepare('SELECT id, role FROM users WHERE token IN ('.$tokens.')');
		$r->execute();
		$userRows = $r->fetchAll(PDO::FETCH_ASSOC);
		$minRole = 0;
		$forUser = 0;
		if (count($userRows) == 1) {
			$forUser = $userRows[0]['id'];
		}
		foreach ($userRows as $row) {
			if ($row['role'] > $minRole) {
				$minRole = $row['role'];
			}
		}	
		$lockedTask = $lockedTask ? 1 : 0;
	}

	if (!$isEditing) {
		$taskToken = generateToken(6);
		$changed = strtotime('now');
		$untilTimestamp = getUntilTimestamp($until);
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
				?,
				null,
				?,
				?,
				?,
				null,
				?,
				?,
				?,
				?,
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
			$title,
			$data,
			$taskToken,
			$minRole,
			$changed,
			$changed,
			$forUser,
			$difficulty,
			$termsId,
			$until,
			$untilTimestamp,
			$lockedTask
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
	} else {
		$taskId = $task_id;
		if (!$noExecs) {
			$r = $db->prepare('
				UPDATE
					tasks
				SET				
					type_id = (SELECT id FROM task_types WHERE code = ?),
					action_id = (SELECT id FROM task_actions WHERE code = ?),
					importance_id = (SELECT id FROM task_importance WHERE code = ?),
					data = ?,
					min_role = ?,
					for_user = ?,
					difficulty = ?,
					term_id = ?,
					until = ?,
					locked = ?
				WHERE 
					id = ?
			');
			$r->execute(array(
				$type,
				$action,
				$importance,
				$data,
				$minRole,
				$forUser,
				$difficulty,
				$termsId,
				$until,
				$lockedTask,
				$task_id,
			));

			$r = $db->prepare('DELETE FROM tasks_users WHERE task_id = ?');
			$r->execute(array($taskId));
			$r = $db->prepare('DELETE FROM tasks_testers WHERE task_id = ?');
			$r->execute(array($taskId));
		} else {
			$r = $db->prepare('
				UPDATE
					tasks
				SET
					data = ?
				WHERE 
					id = ?
			');
			$r->execute(array(
				$data,
				$task_id
			));
		}
	}

	if (!$noExecs) {
		$r = $db->prepare('INSERT INTO tasks_users VALUES ("", ?, ?, ?)');
		foreach ($userRows as $row) {
			$r->execute(array($taskId, $row['id'], $user['project_id']));
		}

		if (!empty($testers)) {
			$tokens = '"'.implode('","', $testers).'"';
			$r = $db->prepare('SELECT id, role FROM users WHERE token IN ('.$tokens.')');
			$r->execute();
			$userRows = $r->fetchAll(PDO::FETCH_ASSOC);
			$r = $db->prepare('INSERT INTO tasks_testers VALUES ("", ?, ?, ?)');
			foreach ($userRows as $row) {
				$r->execute(array($taskId, $row['id'], $user['project_id']));
			}
		}
	}

	$successMessage = !$isEditing ? 'Задача успешно добавлена' : 'Задача успешно сохранена';
	success(
		null,
		$successMessage
	);
}

function getTooltip() {
	$name = $_REQUEST['name'];
	$tooltip = getHelp($name);

	if (!is_array($tooltip)) {
		error('Подсказка не найдена');
	}
	success(array('tooltip' => $tooltip));
}

function loadUrlDialog() {
	success(array(
		'dict' => getDict('url_dialog')
	));
}

function loadInfoDialog() {
	success(array(
		'dict' => getDict('info_dialog')
	));
}

function getExecutors($user, $taskType, $taskAction) {
	global $db;
	$r = $db->prepare('
		SELECT 
			u.id,
			u.token,
			u.name,
			u.avatar_id,
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
		} elseif  ($taskType == 'sysadm') {
			if ($row['spec'] == 'sysadmin') {
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
	$testers = null;
	if ($taskType == 'frontend' || $taskType == 'backend' || $taskType == 'html' || $taskType == 'style') {
		$testers = array();
		foreach ($rows as $row) {
			if  ($row['role'] == 'tester') {
				$row['tester'] = true;
				$testers[] = $row;
			}
		}
	}
	
	return array(
		'proper' => $proper,
		'rest' => $rest,
		'testers' => $testers
	);
}

function loadTaskUsers($user) {
	$dict = getDict('task_users_dialog');
	$dict['users'] = getExecutors($user, $_REQUEST['type'], $_REQUEST['taskAction']);
	success(array(
		'dict' => $dict
	));
}

function loadTaskCounts($user) {
	requireClasses('task');
	success(array(
		'counts' => Task::getTasksCounts($user),
		'progress' => Task::getTasksProgress($user)
	));
}

function loadTaskTerms($user) {
	global $db;
	$r = $db->prepare('SELECT * FROM task_terms ORDER BY id ASC');
	$r->execute();
	$dict = getDict('task_terms');
	$terms = $r->fetchAll(PDO::FETCH_ASSOC);
	$properTerms = array();
	foreach ($terms as $t) {
		if (!empty($prevCode) && $prevCode != $t['code']) {
			$properTerms[] = '';
		}
		$properTerms[] = array('value' => $t['id'], 'name' => $t['value'].' '.decline($t['value'], $t['code']));
		$prevCode = $t['code'];
	}
	
	$dict['terms'] = $properTerms;
	success(array(
		'dict' => $dict
	));
}

function loadTaskInfo($user) {
	global $db;
	requireClasses('task');

	$id = $_REQUEST['id'];
	$r = $db->prepare('
		SELECT 
			t.*,
			u.name AS user_name,
			u.avatar_id,
			ts.code AS status,
			tt.code AS type,
			ta.code AS action,
			ti.code AS importance,
			tp.period
		FROM 
			tasks t
		JOIN 
			users u
			ON u.id = t.user_id
		LEFT JOIN 
			task_statuses ts
			ON t.status_id = ts.id
		LEFT JOIN 
			task_types tt
			ON tt.id = t.type_id
		LEFT JOIN 
			task_actions ta
			ON ta.id = t.action_id
		LEFT JOIN 
			task_importance ti
			ON ti.id = t.importance_id
		LEFT JOIN 
			tasks_periods tp 
			ON t.id = tp.task_id
		WHERE 
			t.id = ?
	');

	$r->execute(array($id));
	$task = $r->fetch(PDO::FETCH_ASSOC);

	$data = json_decode($task['data'], true);
	foreach ($data as $k => $v) {
		$task[$k] = $v;
	}
	unset($task['data']);

	$r = $db->prepare('
		SELECT 
			tu.user_id,
			u.name AS user_name,
			u.avatar_id
		FROM 
			tasks_users tu
		JOIN 
			users u
			ON u.id = tu.user_id
		WHERE 
			tu.task_id = ?
	');
	$r->execute(array($id));
	$taskUsers = $r->fetchAll(PDO::FETCH_ASSOC);

	$r = $db->prepare('
		SELECT 
			tt.user_id,
			u.name AS user_name,
			u.avatar_id
		FROM 
			tasks_testers tt
		JOIN 
			users u
			ON u.id = tt.user_id
		WHERE 
			tt.task_id = ?
	');
	$r->execute(array($id));
	$taskTesters = $r->fetchAll(PDO::FETCH_ASSOC);

	$users = array(
		'author' => array('id' => $task['user_id'], 'avatar_id' => $task['avatar_id'], 'name' => $task['user_name']),
		'executors' => array(),
		'testers' => array()
	);
	$actions = $task['user_id'] == $user['id'];
	foreach ($taskUsers as $usr) {
		if ($usr['user_id'] == $user['id']) {
			$actions = true;
		}
		if ($usr['user_id'] == $task['changed_by']) {
			$users['executor'] = array('id' => $usr['user_id'], 'avatar_id' => $usr['avatar_id'], 'name' => $usr['user_name']);
		} else {
			$users['executors'][] = array('id' => $usr['user_id'], 'avatar_id' => $usr['avatar_id'], 'name' => $usr['user_name']);
		}
	}

	foreach ($taskTesters as $usr) {
		$users['testers'][] = array('id' => $usr['user_id'], 'avatar_id' => $usr['avatar_id'], 'name' => $usr['user_name']);
	}

	$history = array(
		array(
			'action' => 'publish',
			'time' => date('d.m.y H:i', $task['added']),
			'ago' => getFormattedDate(time() - $task['added'], 'ago'),
			'user_id' => $task['user_id'],
			'user_name' => $task['user_name'],
			'avatar_id' => $task['avatar_id']
		)
	);

	$r = $db->prepare('
		SELECT 
			th.changed,
			th.user_id,
			tha.code,
			u.name AS user_name,
			u.avatar_id
		FROM 
			tasks_history th
		JOIN 
			users u
			ON th.user_id = u.id
		JOIN 
			task_history_actions tha
			ON tha.id = th.action_id
		WHERE 
			th.task_id = ?
		ORDER BY
			th.id ASC
	');
	$r->execute(array($id));
	$taskActions = $r->fetchAll(PDO::FETCH_ASSOC);

	foreach ($taskActions as $a) {
		$history[] = array(
			'action' => $a['code'],
			'time' => date('d.m.y H:i', $a['changed']),
			'ago' => getFormattedDate(time() - $a['changed'], 'ago'),
			'user_id' => $a['user_id'],
			'user_name' => $a['user_name'],
			'avatar_id' => $a['avatar_id']
		);
		$lastAction = $a;
	}
	$history = array_reverse($history);
	if (empty($task['status'])) {
		$task['status'] = 'current';
	}
	if (empty($users['executors'])) {
		unset($users['executors']);
	}
	if (empty($users['testers'])) {
		unset($users['testers']);
	}
	$r = $db->prepare('
		SELECT 
			*
		FROM 
			subtasks
		WHERE 
			task_id = ?
	');
	$r->execute(array($id));
	$subtasks = $r->fetchAll(PDO::FETCH_ASSOC);
	$listChecked = array();
	foreach ($subtasks as $i) {
		$listChecked[] = (int)$i['idx'];
	}


	if ($task['status_id'] == 2 && !empty($task['period'])) {
		$task['changed'] -= $task['period'];
	}
	$taskDict = getDict('task');
	$ago = $task['status_id'] != 2 ? 'ago' : '';
	$task['changed'] = $taskDict[$task['status']].' '.getFormattedDate(time() - $task['changed'], $ago);

	$task['timeleft'] = (int)$task['until_timestamp'];
	if ($task['status_id'] == 4) {
		$add = strtotime('now') - $lastAction['changed'];
		$task['timeleft'] += $add;	
	}
	if ($task['status_id'] != 1 && $task['status_id'] != 5) {
		$allTime = $task['timeleft'] - $task['added'];
		$percent = $allTime / 100;
		$passedTime = time() - $task['added'];
		$task['scale'] = min(100, max(1, round($passedTime / $percent)));
	}
	if ($task['status_id'] == 1) {
		$r = $db->prepare('
			SELECT 
				period
			FROM 
				tasks_periods
			WHERE 
				task_id = ?
		');
		$r->execute(array($id));
		$taskPeriod = $r->fetch(PDO::FETCH_ASSOC);

		$task['added'] += strtotime('now') - $lastAction['changed'];
		$task['timeleft'] = getFormattedDate($taskPeriod['period'], 'in_work');
		$task['timepassed'] = getFormattedDate(time() - $task['added'] - $taskPeriod['period'], 'waited');
	} else {
		extract(Task::getTaskTimeLeft($task['timeleft']));
		$task['timeleft'] = $timeleft;
		$task['overdue'] = $overdue;
		$task['timepassed'] = getFormattedDate(time() - $task['added'], 'passed');
	}

	unset($task['added'], $task['status_id'], $task['until_timestamp']);
	
	
	$properInfo = array();
	if (is_array($task['info'])) {
		foreach ($task['info'] as $k => $v) {
			$properInfo[] = array('key' => $k, 'value' => $v);
		}
	}
	$task['info'] = $properInfo;
	success(array(
		'listChecked' => $listChecked,
		'task' => $task,
		'users' => $users,
		'history' => $history,
		'comments' => array(),
		'problems' => array(),
		'actions' => $actions,
		'status' => $task['status'],
		'dict' => getDict(array('task_info', 'info_dialog')),
		'executor' => $task['changed_by'],
		'own' => $task['changed_by'] == $user['id'] || $task['user_id'] == $user['id']
	));
}

function loadBoard($user) {
	requireClasses('board');
	success(Board::getTasks($user));
}

function checkSubtask($user) {
	$id = $_REQUEST['id'];
	$idx = $_REQUEST['idx'];
	$checked = $_REQUEST['checked'];
	requireClasses('task');
	
	$sql = '
		SELECT 
			id
		FROM 
			tasks
		WHERE
			id = ?
		AND 
			status_id = 2
		AND 
			(changed_by = ? OR user_id = ?)
	';
	
	$row = DB::get($sql, array($id, $user['id'], $user['id']));
	if (!is_array($row)) {
		noRightsError();
	}
	Task::checkSubtask($id, $idx, $checked);
	success();
}

function getUntilTimestamp($value) {
	if ($value[0] === 'n') {
		$day = (int)str_replace('n', '', $value);
		$currentDate = (int)date('d');
		$month = (int)date('m');
		$year = (int)date('Y');
		if ($currentDate >= $day) {
			$month++;
			if ($month == 13) {
				$month = 1;
				$year++;
			}
		}
		$timestamp = strtotime(($day < 10 ? '0'.$day : $day).'.'.($month < 10 ? '0'.$month : $month).'.'.$year);			
	} else {
		switch ((int)$value) {
			case 0:
				$timestamp = strtotime(date('d.m.Y 13:00:00'));
			break;

			case 1:
				$timestamp = strtotime(date('d.m.Y 18:59:59'));
			break;

			case 2:
				$timestamp = strtotime(date('d.m.Y 23:59:59'));
			break;

			case 3:
				$timestamp = strtotime('tomorrow 13:00:00');
			break;

			case 4:
				$timestamp = strtotime('tomorrow 18:59:59');
			break;

			case 6:
				$timestamp = strtotime('next monday');
			break;

			case 7:
				$timestamp = strtotime('next tuesday');
			break;

			case 8:
				$timestamp = strtotime('next wednesday');
			break;

			case 9:
				$timestamp = strtotime('next thursday');
			break;

			case 10:
				$timestamp = strtotime('next friday');
			break;

			case 11:
				$timestamp = strtotime('next saturday');
			break;

			case 12:
				$timestamp = strtotime('next sunday');
			break;

			case 14:
				$timestamp = strtotime('next monday');
			break;

			case 15:
				$month = (int)date('m') + 1;
				$year = (int)date('Y');
				if ($month == 13) {
					$month = 1;
					$year++;
				}
				$date = '01.'.($month < 10 ? '0'.$month : $month).'.'.$year;
				$timestamp = strtotime($date);
			break;

			case 16:
				$year = (int)date('Y') + 1;
				$date = '01.01.'.$year;
				$timestamp = strtotime($date);
			break;
		}
	}
	return $timestamp;
}

function loadUntilDate() {
	$timestamp = getUntilTimestamp($_REQUEST['value']);
	$diff = $timestamp - time();
	$left = 'left';
    if ($diff < 0) {
    	$diff = -$diff;
    	$left = 'overdue';
    }
	$value = getFormattedDate($diff, $left);
	success(
		array(
			'value' => $value
		)
	);
	unknownError();
}

function doTaskAction($user) {
	global $db;
	$id = $_REQUEST['id'];
	$name = $_REQUEST['name'];
	$actions = getAccessableTaskActions($user, $id);
	if (!in_array($name, $actions)) {
		noRightsError();
	}
	switch ($name) {
		case 'continue':
		case 'take':
			takeTask($user, $id);
		break;

		case 'delay':
			logTaskInWorkTime($id);
			delayTask($id);
		break;

		case 'complete':
			logTaskInWorkTime($id);
			completeTask($id);
		break;

		case 'resume':
			resumeTask($id);
		break;

		case 'refuse':
			logTaskInWorkTime($id);
			refuseTask($id);
		break;

		case 'close':
			closeTask($id);
		break;

		case 'unblock':
			unblockTask($id);
		break;

		case 'freeze':
			freezeTask($id);
		break;

		case 'unfreeze':
			unfreezeTask($id);
		break;

		case 'open':
			openTask($id);
		break;
	}
	logTaskAction($id, $name, $user);
	success();  
}

function logTaskInWorkTime($id) {
	global $db;
	$r = $db->prepare('
		SELECT 
			changed
		FROM 
			tasks
		WHERE 
			status_id = 2
		AND
			id = ?
	');
	$r->execute(array($id));
	$task = $r->fetch(PDO::FETCH_ASSOC);
	if (is_array($task)) {
		$now = strtotime('now');
		$period = $now - $task['changed'];
	}
	$r = $db->prepare('
		SELECT 
			period
		FROM 
			tasks_periods
		WHERE 
			task_id = ?
	');
	$r->execute(array($id));
	$taskPeriod = $r->fetch(PDO::FETCH_ASSOC);
	if (is_array($taskPeriod)) {
		$period += (int)$taskPeriod['period'];
	}
	$r = $db->prepare('
		INSERT INTO
			tasks_periods
		VALUES (?, ?) ON DUPLICATE KEY UPDATE
			period = ?
	');
	$r->execute(array($id, $period, $period));
}

function logTaskAction($id, $name, $user) {
	global $db;
	$r = $db->prepare('
		INSERT INTO
			tasks_history
		VALUES (
			"",
			?,
			?,
			(SELECT id FROM task_history_actions WHERE code = ?),
			?
		)
	');
	$r->execute(array(
		$user['id'],
		$id,
		$name,
		strtotime('now')
	));
}

function unblockTask($id) {
	global $db;

	$r = $db->prepare('
		UPDATE 
			tasks
		SET
			locked = 0,
			added = ?
		WHERE
			id = ?');
	$r->execute(array(strtotime('now'), $id));
}

function freezeTask($id) {
	global $db;
	$r = $db->prepare('
		SELECT 
			importance_id
		FROM 
			tasks
		WHERE 
			id = ?
	');
	$r->execute(array($id));
	$row = $r->fetch(PDO::FETCH_ASSOC);
	
	$r = $db->prepare('INSERT INTO frozen_tasks VALUES (?, ?)');
	$r->execute(array($id, $row['importance_id']));
	
	$r = $db->prepare('
		UPDATE 
			tasks
		SET 
			changed = ?,
			status_id = 4,
			importance_id = 6
		WHERE 
			id = ?
	');
	$r->execute(array(strtotime('now'), $id));
}

function unfreezeTask($id) {
	global $db;
	
	$r = $db->prepare('
		SELECT 
			importance_id
		FROM 
			frozen_tasks
		WHERE 
			task_id = ?
	');
	$r->execute(array($id));
	$row = $r->fetch(PDO::FETCH_ASSOC);

	$r = $db->prepare('
		DELETE FROM 
			frozen_tasks
		WHERE 
			task_id = ?
	');
	$r->execute(array($id));
	
	$r = $db->prepare('
		UPDATE 
			tasks
		SET 
			changed = ?,
			status_id = NULL,
			importance_id = ?
		WHERE 
			id = ?
	');
	$r->execute(array(strtotime('now'), $row['importance_id'], $id));
}

function closeTask($id) {
	global $db;
	$r = $db->prepare('
		UPDATE 
			tasks
		SET 
			changed = ?,
			status_id = 5
		WHERE 
			id = ?
	');
	$r->execute(array(strtotime('now'), $id));
}

function openTask($id) {
	global $db;
	$r = $db->prepare('
		UPDATE 
			tasks
		SET 
			changed = ?,
			status_id = NULL
		WHERE 
			id = ?
	');
	$r->execute(array(strtotime('now'), $id));
}

function completeTask($id) {
	global $db;
	$r = $db->prepare('
		UPDATE 
			tasks
		SET 
			changed = ?,
			status_id = 1
		WHERE 
			id = ?
	');
	$r->execute(array(strtotime('now'), $id));
}

function resumeTask($id) {
	global $db;
	$r = $db->prepare('
		UPDATE 
			tasks
		SET 
			changed = ?,
			status_id = 2
		WHERE 
			id = ?
	');
	$r->execute(array(strtotime('now'), $id));
}

function refuseTask($id) {
	global $db;
	$r = $db->prepare('
		UPDATE 
			tasks t
		SET 
			t.changed = t.added,
			t.changed_by = NULL,
			t.status_id = NULL
		WHERE 
			t.id = ?
	');
	$r->execute(array($id));
}

function takeTask($user, $id) {
	global $db;
	$currentTaskId = getCurrentTaskInWork($user);
	if (!empty($currentTaskId)) {
		delayTask($currentTaskId);
	}
	$r = $db->prepare('
		UPDATE 
			tasks
		SET 
			changed = ?,
			changed_by = ?,
			status_id = 2
		WHERE 
			id = ?
	');
	$r->execute(array(strtotime('now'), $user['id'], $id));
}


function delayTask($id) {
	global $db;
	$r = $db->prepare('
		UPDATE 
			tasks
		SET 
			changed = ?,
			status_id = 3
		WHERE 
			id = ?
	');
	$r->execute(array(strtotime('now'), $id));
}

function getCurrentTaskInWork($user) {
	global $db;
	$r = $db->prepare('
		SELECT 
			id
		FROM 
			tasks
		WHERE 
			status_id = 2
		AND
			changed_by = ?
	');
	$r->execute(array($user['id']));
	$task = $r->fetch(PDO::FETCH_ASSOC);
	if (is_array($task)) {
		return $task['id'];
	}
}
 
function loadTaskActions($user) {
	$id = $_REQUEST['id'];
	$accessibleActions = getAccessableTaskActions($user, $id);
	if (in_array('admin', $accessibleActions)) {
		$allActions = array(
			'unblock', 'edit', 'start', 'assign', 'open', 'close', 'freeze', 'unfreeze', 'comment', 'remove'
		);
	} else {
		$allActions = array(
			'estimate', 'take', 'complete', 'continue', 'delay', 'refuse', 'resume', 'problem', 'comment'
		);
	}	
	
	$actions = array();
	$availableActions = array();
	foreach ($allActions as $a) {
		if (in_array($a, $accessibleActions)) {
			$availableActions[] = array('name' => $a, 'available' => true);	
		} else {
			$actions[] = array('name' => $a, 'available' => false);
		}
	}
	$data = array(
		'actions' => array_merge($availableActions, $actions),
		'dict' => getDict('task_actions'),
		'task_id' => $id
	);
	success($data);
}

function loadWorkStatus($user) {
	global $db;
	$r = $db->prepare('
		SELECT 
			work_status_id,
			reason
		FROM 
			user_work_statuses
		WHERE 
			user_id = ?
	');
	$r->execute(array($user['id']));
	$row = $r->fetch(PDO::FETCH_ASSOC);

	$usersDict = getDict('work_statuses');
	$dict = getDict('work_statuses');
	$statuses = array();
	$reasonShown = false;
	foreach ($dict['statuses'] as $id => $name) {
		$s = array('id' => $id, 'name' => $name);
		if (is_array($row) && $row['work_status_id'] == $id) {
			$s['current'] = true;
			if ($row['work_status_id'] == 2) {
				$reasonShown = true;
			}
		}
		$statuses[] = $s;
	}
	unset($dict['statuses']);
	success(
		array(
			'dict' => $dict,
			'statuses' => $statuses,
			'reasonShown' => $reasonShown,
			'reason' => $row['reason']
		)
	);
}

function saveWorkStatus($user) {
	global $db;
	
	$status = $_REQUEST['status'];
	$reason = $_REQUEST['reason'];
	$r = $db->prepare('
		INSERT INTO
			user_work_statuses
		VALUES (?, ?, ?)
		ON DUPLICATE KEY UPDATE 
		work_status_id = ?,
		reason = ?
	');
	$r->execute(array($user['id'], $status, $reason, $status, $reason));
	success(null, 'Статус успешно изменен');
}

function getAccessableTaskActions($user, $id) {
	global $db;
	$r = $db->prepare('
		SELECT 
			t.*,
			u.role AS role_id
		FROM 
			tasks t
		JOIN users u
			ON t.user_id = u.id 
		WHERE 
			t.id = ?
		AND 
			t.team_id = ?
	');
	$r->execute(array($id, $user['team_id']));
	$task = $r->fetch(PDO::FETCH_ASSOC);
	$changedBy = $task['changed_by'];
	$status = $task['status_id'];
	$minRole = $task['min_role'];

	if (!is_array($task)) {
		noRightsError();
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
	
	$isUserTask = is_array($taskUser) && ($changedBy == $user['id'] || empty($status) || $status == 4);
	$actions = array();
	if ($isUserTask) {
		// in_work
		if (!empty($task['locked'])) {
			$actions[] = 'estimate';
		} else {
			if ($status == 2) {
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
			elseif ($status == 3) {
				$actions[] = 'continue';
				$actions[] = 'refuse';
				$actions[] = 'problem';
			}
			if (empty($status) || $status == 4) {
				$actions[] = 'estimate';
			}
			$actions[] = 'comment';
		}
	}
	if ($user['role_id'] < $minRole) {
		$hasPower = $user['role_id'] <= $task['role_id'];
		$actions[] = 'admin';
		if ($hasPower && $status != 2 && $task['locked'] == 0) {
			$actions[] = 'start';
		}
		if ($hasPower && $task['locked'] == 1) {
			$actions[] = 'unblock';	
		}
		if ($task['locked'] == 0 && ($status > 2 || empty($status))) {
			$actions[] = 'assign';
		}
		if ($status != 1 && $status != 5 && $hasPower) {
			$actions[] = 'edit';
		}		 
		// ready
		if ($status == 1 || $status == 3) {
			$actions[] = 'close';
		} elseif ($status == 4) {
			$actions[] = 'unfreeze';
		} elseif ($status == 5) {
			$actions[] = 'open';
		}
		if ($hasPower && $status != 2) {
			$actions[] = 'remove';
		}
		if ($task['locked'] == 0 && $hasPower && (empty($status) || $status == 3)) {
			$actions[] = 'freeze';	
		}
		$actions[] = 'comment';
	}
	return $actions;
}

function loadTask($user) {
	global $db;
	$id = $_REQUEST['id'];
	$r = $db->prepare('
		SELECT 
			t.*,
			tt.code AS type,
			ta.code AS action,
			ti.code AS importance
		FROM 
			tasks t
		JOIN task_types tt
			ON t.type_id = tt.id
		JOIN task_actions ta
			ON t.action_id = ta.id
		JOIN task_importance ti
			ON t.importance_id = ti.id
		WHERE 
			t.id = ?
		AND 
			t.team_id = ?
		AND 
			t.min_role >= ?
	');
	$r->execute(array($id, $user['team_id'], $user['role_id']));
	$task = $r->fetch(PDO::FETCH_ASSOC);
	if (!is_array($task)) {
		noRightsError();
	}
	$data = json_decode($task['data'], true);
	if (!is_array($data)) {
		unknownError();
	}
	$data['formData'] = array(
		'title' => $task['title'],
		'description' => $data['descr'],
	);
	$data['task_id'] = (int)$id;
	$data['status'] = 'active';
	$data['visualElements'] = $data['elements'];
	$data['task_inwork'] = $task['status_id'] == 2 || $task['status_id'] == 3;
	$data['type'] = $task['type'];
	$data['action'] = $task['action'];
	$data['importance'] = $task['importance'];
	$data['difficulty'] = $task['difficulty'];
	$data['termsId'] = $task['term_id'];
	$data['until'] = $task['until'];
	unset($data['descr'], $data['elements']);
	success($data);
}

function loadTasks($user) {
	global $db;
	requireClasses('task');
	$filter = $_REQUEST['filter'];
	$status = $_REQUEST['status'];
	if ($status[0] == '[') {
		$status = json_decode($status, true);
	}
	$type = $_REQUEST['type'];
	$importance = $_REQUEST['importance'];

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

	$sqlStatus = ' AND (t.status_id < 5 OR t.status_id IS NULL)';
	if (!empty($status)) {
		if (!is_array($status)) {
			$status = array($status);
		}
		$sqlStatus = '';
		$statuses = array();
		foreach ($status as $s) {
			if (!empty($s)) {
				switch ($s) { 
					case 'ready':
						$statuses[] = 't.status_id = 1';
					break;
					case 'in_work':
						$statuses[] = 't.status_id = 2';
					break;
					case 'delayed':
						$statuses[] = 't.status_id = 3';
					break;
					case 'frozen':
						$statuses[] = 't.status_id = 4';
					break;
					case 'closed':
						$statuses[] = 't.status_id = 5';
					break;		
					case 'current':
						$statuses[] = 't.status_id IS NULL';
					break;
				}
			}
		}
		if (!empty($statuses)) {
			$sqlStatus = ' AND ('.implode(" OR ", $statuses).')';
		}
	}
	

	
	$sqlParams = array(
		$user['project_id'],
		$user['role_id']
	);
	$typeSql = '';
	if (!empty($type)) {
		$types = '"'.implode(explode(",", $type), '","').'"';
		$typeSql = ' AND type_id IN (SELECT id FROM task_types WHERE code IN ('.$types.')) ';
	}
	$impSql = '';
	if (!empty($importance)) {
		$importances = '"'.implode(explode(",", $importance), '","').'"';
		$impSql = ' AND importance_id IN (SELECT id FROM task_importance WHERE code IN ('.$importances.')) ';
	}

	if ($user['role_id'] < 4) {
		$user['role_id'] = 0;
	}

	switch ($filter) {
		case 'fromme':
			array_unshift($sqlParams, $user['id']);
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
					u2.avatar_id AS avatar_id2,
					tp.period
					
				FROM tasks t
				LEFT JOIN tasks_periods tp
					ON t.id = tp.task_id
				LEFT JOIN task_types tt
					ON tt.id = t.type_id
				LEFT JOIN task_actions ta
					ON ta.id = t.action_id
				LEFT JOIN task_importance ti
					ON ti.id = t.importance_id
				LEFT JOIN task_statuses ts
					ON ts.id = t.status_id
				LEFT JOIN users u
					ON t.user_id = u.id
				LEFT JOIN users u2
					ON t.changed_by = u2.id
				WHERE 
					t.user_id = ?
				AND
					t.project_id = ?
				AND 
					t.min_role >= ?
					'.$sqlStatus.'
					'.$typeSql.'
					'.$impSql.'
				ORDER BY 
					t.importance_id ASC
			');
			$r->execute($sqlParams);

		break;

		case 'my':
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
					u2.avatar_id AS avatar_id2,
					tp.period
					
				FROM tasks t
				LEFT JOIN tasks_periods tp
					ON t.id = tp.task_id
				LEFT JOIN task_types tt
					ON tt.id = t.type_id
				LEFT JOIN task_actions ta
					ON ta.id = t.action_id
				LEFT JOIN task_importance ti
					ON ti.id = t.importance_id
				LEFT JOIN task_statuses ts
					ON ts.id = t.status_id
				LEFT JOIN users u
					ON t.user_id = u.id
				LEFT JOIN users u2
					ON t.changed_by = u2.id
				WHERE 
					(t.changed_by = ? OR t.for_user = ?)
				AND
					t.project_id = ?
				'.$sqlStatus.'
				ORDER BY 
					t.importance_id ASC
			');
			$r->execute(array($user['id'], $user['id'], $user['project_id']));
		break;

		case 'forme':
			array_unshift($sqlParams, $user['id']);
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
					u2.avatar_id AS avatar_id2,
					tp.period
					
				FROM 
					tasks_users tu
				LEFT JOIN tasks_periods tp
					ON tu.task_id = tp.task_id
				LEFT JOIN tasks t
					ON t.id = tu.task_id
				LEFT JOIN task_types tt
					ON tt.id = t.type_id
				LEFT JOIN task_actions ta
					ON ta.id = t.action_id
				LEFT JOIN task_importance ti
					ON ti.id = t.importance_id
				LEFT JOIN task_statuses ts
					ON ts.id = t.status_id
				LEFT JOIN users u
					ON t.user_id = u.id
				LEFT JOIN users u2
					ON t.changed_by = u2.id
				WHERE 
					tu.user_id = ?
				AND
					tu.project_id = ?
				AND 
					t.min_role >= ?
					'.$sqlStatus.'
					'.$typeSql.'
					'.$impSql.'
				ORDER BY 
					t.importance_id ASC
			');
			$r->execute($sqlParams);

		break;
		
		default:
			array_unshift($sqlParams, $user['id'], $user['team_id']);
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
					u2.avatar_id AS avatar_id2,
					tu.id AS task_user,
					tp.period
				FROM 
					tasks t
				LEFT JOIN tasks_periods tp
					ON t.id = tp.task_id
				LEFT JOIN tasks_users tu
					ON t.id = tu.task_id AND tu.user_id = ?
				LEFT JOIN task_types tt
					ON tt.id = t.type_id
				LEFT JOIN task_actions ta
					ON ta.id = t.action_id
				LEFT JOIN task_importance ti
					ON ti.id = t.importance_id
				LEFT JOIN task_statuses ts
					ON ts.id = t.status_id
				LEFT JOIN users u
					ON t.user_id = u.id
				LEFT JOIN users u2
					ON t.changed_by = u2.id
				WHERE 
					t.team_id = ?
				AND
					t.project_id = ?
				AND 
					t.min_role >= ?
					'.$sqlStatus.'
					'.$typeSql.'
					'.$impSql.'
				ORDER BY 
					t.importance_id ASC
			');
			$r->execute($sqlParams);
	}
	
	$rows = $r->fetchAll(PDO::FETCH_ASSOC);  
	$tasks = array();
	if ($user['role_id'] < 5) {
		$byStatus = array(
			'ready' => array(),
			'in_work' => array(),
			'locked' => array(),
			'current' => array(),
			'delayed' => array(),
			'frozen' => array(),
			'rest' => array()
		);
	} else {
		$byStatus = array(
			'current' => array(),
			'locked' => array(),
			'in_work' => array(),
			'ready' => array(),
			'delayed' => array(),
			'frozen' => array(),
			'rest' => array()
		);
	}
	$dict = getDict('task');
	foreach ($rows as $row) {
		$row['actions'] = true;
		if ($user['role_id'] > 4 && 
			(($filter == 'all' && empty($row['task_user'])) || 
			!empty($row['changed_by']) && $row['changed_by'] != $user['id'])
		) {
			$row['actions'] = false;
		}
		if (!empty($row['user_name2'])) {
			$row['user_name'] = $row['user_name2'];
			$row['avatar_id'] = $row['avatar_id2'];
			unset($row['user_name2'], $row['avatar_id2']);
		}
		$row['locked'] = $row['locked'] == 1;
		if (empty($row['status'])) {
			if (!empty($row['locked'])) {
				$row['status'] = 'locked';
			} else {
				$row['status'] = 'current';
			}
		}
		if ($row['status'] == 'in_work' && !empty($row['period'])) {
			$row['changed'] -= $row['period'];
		}
		if ($row['status'] == 'current' || $row['status'] == 'in_work') {
			extract(Task::getTaskTimeLeft($row['until_timestamp']));
			$row['timeleft'] = $timeleft;
			$row['overdue'] = $overdue;
		}
		$ago = $row['status'] != 'in_work' ? 'ago' : '';
		$row['changed'] = $dict[$row['status']].' '.getFormattedDate(time() - $row['changed'], $ago);
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

function getFormattedDate($date, $ago = null) {
	$language = getLang();
	$dict = getDict('time'); 
 	
 	if ($ago == 'waited' && $language == 'ru') {
 		$dict['second'] = $dict['_second'];
 		$dict['minute'] = $dict['_minute'];
 	}
    $seconds = array( $dict['second'], $dict['seconds'], $dict['seconds2'] );
    $minutes = array( $dict['minute'], $dict['minutes'], $dict['minutes2'] );
    $hours   = array( $dict['hour'], $dict['hours'], $dict['hours2'] );
    $days    = array( $dict['day'], $dict['days'], $dict['days2'] );
    $months  = array( $dict['month'], $dict['months'], $dict['months2'] );
    $years   = array( $dict['year'], $dict['years'], $dict['years2'] );
    $decades = array( $dict['decade'], $dict['decades'], $dict['decades2'] );
 
    $phrase = array($decades, $years, $months,  $days, $hours,  $minutes, $seconds);
    $length = array(315705600, 31570560, 2630880, 86400, 3600, 60, 1);
 
    $str = array();
    if ($date == 0) {
    	return $dict['just_now'];
    }
    $firstVal = 0;
    $firstType = 999;
    foreach ($length as $i => $l) {
    	if ($date >= $l) {
    		if (!empty($firstVal) && $l == 1) {
    			break;
    		}
    		if ($firstType < 3 && $i > 3) {
				break;
    		}
    		if ($firstType == 3 && $i > 4) {
				break;
    		}
	    	$v = floor($date / $l);
	    	if (empty($firstVal)) {
	    		$firstVal = $v;
	    		$firstType = $i;
	    	}

	    	$str[] = $v.' '.getPhrase($v, $phrase[$i]);
	    	$date = $date - ($v * $l);	    	
    	}
    }
    $str = implode(' ', $str);
    if ($ago === 'overdue') {
    	return  $dict['overdue'].' '.$str;
    } elseif ($ago == 'left') {
    	if ($language == 'ru') {
    		return  getPhrase($firstVal, $dict['left']).' '.$str;
    	}
    	return  $str.' '.getPhrase($firstVal, $dict['left']);
    } elseif ($ago == 'waited') {
		return  $dict['waited'].' '.$str;
    } elseif ($ago == 'in_work') {
		return  $dict['in_work'].' '.$str;
    } elseif ($ago == 'passed') {
    	$key = 'passed';
    	if ($firstType > 4) {
    		$key = 'passed2';
    	}
    	if ($language == 'ru') {
    		return  getPhrase($firstVal, $dict[$key]).' '.$str;
    	}
    	return  $str.' '.getPhrase($firstVal, $dict[$key]);
    } elseif ($ago == 'ago') {
		return $str.' '.$dict['ago'];
    }
    return $str;
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

function decline($number, $keyword) {
	$dict = getDict('declined');
  	$cases = array (2, 0, 1, 1, 1, 2);
  	return $dict[$keyword][ ($number % 100 > 4 && $number % 100 < 20) ? 2 : $cases[min($number % 10, 5)] ];
}

$action = $_GET['action'];
$token = $_GET['token'];

if ($action == 'dictionary') {
	include 'dictionary/index.php';
}

requireClasses('user');

if (!empty($token)) {	
	$user = User::get($token);

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
				setCurrentProject($user);
			break;

			case 'load_user':
				User::load($user);
			break;

			case 'logout':
				User::logout($token);
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

			case 'load_projects_list':
				loadProjectsList($user);
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

			case 'load_task_terms':
				loadTaskTerms($user);
			break;

			case 'load_task_actions':
				loadTaskActions($user);
			break;

			case 'load_work_status':
				loadWorkStatus($user);
			break;

			case 'save_work_status':
				saveWorkStatus($user);
			break;

			case 'task_action':
				doTaskAction($user);
			break;

			case 'load_task':
				loadTask($user);
			break;

			case 'load_task_counts':
				loadTaskCounts($user);
			break;

			case 'load_until_date':
				loadUntilDate();
			break;

			case 'check_subtask':
				checkSubtask($user);
			break;

			case 'load_board':
				loadBoard($user);
			break;
		}
	} else {
		error('По текущему токену сессии пользователь не найден, авторизуйтесь заново', 'invalid_token');
	}
} else {
	if (isset($_REQUEST['login'])) {
		if ($action == 'auth') {
			User::auth();
		} elseif ($action == 'register') {
			User::register();
		}
	}
}
unknownError();