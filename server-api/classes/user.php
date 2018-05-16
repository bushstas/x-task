<?php

class User {
	static function logout() {
		$actor = Actor::get();
		$sql = '
			DELETE FROM
				sessions
			WHERE 
				token = ?
		';
		DB::execute($sql, array($actor['token']));
		success();
	}

	static function auth() {
		$login    = $_POST['login'];
		$password = $_POST['password'];
		
		if (empty($login) || empty($password)) {
			error('Введите логин и пароль');
		}
		$password = md5($password);
		
		$sql = '
			SELECT 
				id,
				blocked_by 
			FROM 
				users 
			WHERE 
				login = ? and password = ?
		';
		$user = DB::get($sql, array($login, $password));

		if ($user['blocked_by'] != null) {
			error('Ваш аккаунт был заблокирован, авторизация невозможна');
		}

		self::createSession($user['id']);
		error('Неверная связка логин/пароль');
	}

	static function create() {
		self::register(Actor::get());
	}

	static function register($actor = null) {
		$byAdmin = !empty($actor);

		if ($byAdmin && $actor['role'] != 'head' && $actor['role'] != 'admin') {
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
			$sql = '
				SELECT 
					team_id,
					role_id 
				FROM 
					invitations 
				WHERE 
					token = ?
			';
			$row = DB::get($sql, array($code));
			if (!is_array($row)) {
				error('Приглашение на найдено');
			}
			$byInvitation = true;
			$invitationRole = $row['role_id'];
			$invitationTeam = $row['team_id'];
		}
		
		$sql = '
			SELECT 
				* 
			FROM 
				users 
			WHERE 
				login = ? OR
				password = ? OR 
				email = ?
		';
		$row = DB::get($sql, array($login, $password, $email));
		validateUniqueness($login, $password, $email, $row);

		$token = generateUniqueToken('users');
		$team = $byAdmin ? $actor['team_id'] : null;
		$role = $byAdmin ? $role : 1;
		$spec = $byAdmin ? $spec : null;
		if ($byInvitation === true) {
			$role = $invitationRole;
			$team = $invitationTeam;
			requireClasses('invitation');
			$projects = Invitation::getInvitationProjects($code);

			$sql = '
				DELETE FROM 
					invitations_projects 
				WHERE 
					invitation_id = (SELECT id FROM invitations WHERE token = ?)
			';
			DB::execute($sql, array($code));
			
			$sql = '
				DELETE FROM 
					invitations 
				WHERE 
					token = ?
			';
			DB::execute($sql, array($code));
		}
		$sql = '
			INSERT INTO  
				users
			VALUES( 
				"", ?, ?, ?, ?, ?, ?, ?, null, ?, null, ?
			)
		';
		$avatarId = self::getRandomAvatar($team);		
		DB::execute($sql, array($userName, $email, $token, $login, md5($password), $role, $spec, $team, $avatarId));

		$sql = '
			SELECT 
				id
			FROM 
				users 
			WHERE 
				token = ?
		';
		$newUserId = DB::get($sql, array($token), 'id');
		if (empty($newUserId)) {
			error('Во время регистрации произошла ошибка');
		}

		if (!$byAdmin && !$byInvitation) {
			
			$teamToken = generateUniqueToken('teams');
			$sql = '
				INSERT INTO  
					teams
				VALUES( 
					"", ?, ?
				)
			';
			DB::execute($sql, array($newUserId, $teamToken));

			$sql = '
				SELECT 
					id
				FROM 
					teams 
				WHERE 
					token = ?
			';
			$newTeamId = DB::get($sql, array($teamToken), 'id');
			if (empty($newTeamId)) {
				error('Во время регистрации произошла ошибка');
			}

			$sql = '
				UPDATE 
					users 
				SET
					team_id = ?
				WHERE 
					token = ?
			';
			DB::execute($sql, array($newTeamId, $token));
		} else if ($role > 2) {
			if (is_array($projects)) {
				$projects = getProjectsIds($projects);
				foreach ($projects as $projectId) {
					$sql = '
						INSERT INTO  
							users_projects
						VALUES( 
							"", ?, ?
						)
					';
					DB::execute($sql, array($newUserId, $projectId));
				}
			}
		}
		if (!$byAdmin) {
			createSession($newUserId);
			unknownError();
		}
		success();
	}

	private static function getRandomAvatar($teamId) {
		$avatars = self::getTeamUsedAvatars($teamId);
		$ids = array();
		foreach ($avatars as $avatar) {
			$ids[] = (int)$avatar['avatar_id'];
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

	static function getTeamUsedAvatars($teamId) {
		$sql = 'SELECT avatar_id FROM users WHERE team_id = ?';
		return DB::select($sql, array($teamId));
	}

	static function load() {
		$actor = Actor::get();
		$projects = self::getProjects($actor['id']);
		$data = array(
			'user' => $actor,
			'rights' => self::getRights($actor['role'])
		);
		if (!empty($actor['project_id'])) {
			$data['project'] = self::getProject($actor['project_id']);
		}
		if (count($projects) > 0) {			
			if (empty($data['project'])) {
				$data['project'] = self::getProject($projects[0]['id']);
			}		
			$properProjects = array();
			foreach ($projects as $project) {
				$properProjects[] = $project['token'];
			}
			$data['projects'] = $properProjects;		
		}
		requireClasses('task');
		success($data);
	}

	private static function getProjects($userId) {
		$sql = '
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
		';
		return DB::select($sql, array($userId));
	}

	private static function getRights($role) {
		$sql = '
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
		';
		$rows = DB::select($sql, array($role));
		$rights = array();
		foreach ($rows as $r) {
			$rights[] = $r['code'];
		}
		return $rights;
	}

	private static function getProject($token) {
		requireClasses('project');
		return Project::get($token);
	}

	private static function createSession($userId) {
		if (!empty($userId)) {
			$sql = '
				SELECT 
					token
				FROM 
					sessions 
				WHERE 
					user_id = ?
			';
			$token = DB::get($sql, array($userId), 'token');
			
			if (!empty($token)) {
				$sql = '
					UPDATE 
						sessions 
					SET
						timestamp = ?
					WHERE 
						user_id = ?
				';
				DB::execute($sql, array(strtotime('now'), $userId));
			} else {
				$token = generateUniqueToken('sessions');
				$sql = '
					INSERT INTO  
						sessions
					VALUES( 
						"", ?, ?, ?
					)
				';
				DB::execute($sql, array($userId, $token, strtotime('now')));
			}

			success(array(
				'token' => $token
			));
		}
	}

	static function refresh() {
		self::get(true);
	}

	static function get($refreshing = false) {
		$actor = Actor::get();
		$sql = 'SET SESSION group_concat_max_len = 1000000;';
		DB::execute($sql);
		
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
			$projectCondition = ' AND u.project_id = '.$actor['project_id'];
		}
		$dict = getDict('work_statuses');
		$sql = '
			SELECT 
				u.id,
				u.avatar_id,
				u.token,
				u.role AS role_id,
				pr.name AS project_name,
				u.name,
				u2.name AS blockedBy,
				r.code AS role,
				s.code AS spec,
				t.title AS task,
				t.id AS task_id,
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
		';
		$users = DB::select($sql, array($actor['team_id']));

		foreach ($users as &$u) {
			if (empty($u['work_status_id'])) {
				$u['work_status_id'] = 2;
			}
			$u['status'] = $dict['statuses'][$u['work_status_id']];
			if ($u['role'] == 'head' || $u['role'] == 'admin') {
				$u['projects'] = '*';
			}
		}

		$sql = '
			SELECT 
				token
			FROM 
				teams
			WHERE 
				id = ?
		';
		$token = DB::get($sql, array($actor['team_id']), 'token');

		$sql = '
			SELECT 
				id,
				code
			FROM 
				specs
			ORDER BY id
		';
		$specs = DB::select($sql);
		
		$sql = '
			SELECT 
				token,
				name
			FROM 
				projects
			WHERE 
				team_id = ?
				
		';
		$projects = DB::select($sql, array($actor['team_id']));


		$sql = '
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
		';
		$rows = DB::select($sql, array($actor['team_id']));
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

		$sql = '
			SELECT 
				task_id,
				user_id
			FROM 
				tasks_users
			WHERE 
				team_id = ?
		';
		$rows = DB::select($sql, array($actor['team_id']));
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
			$u['edit_status'] = false;			
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
			$u['actions'] = false;
			if ($actor['role_id'] <= 4 && ($actor['role_id'] < $u['role_id'])) {
				$u['actions'] = true;
				$u['edit_status'] = true;
			}
		}

		if ($refreshing) {
			success(array(
				'users' => $users
			));
		}

		success(array(
			'users' => $users,
			'roles' => getRoles(),
			'specs' => $specs,
			'projects' => $projects
		));
	}

	static function save() {
		$actor = Actor::get();
		$userId    = validateUserIdAndRightsToEditUser('save');
		$login     = validateLogin($_REQUEST['login']);
		$password  = validatePassword($_REQUEST['password'], $_REQUEST['password2'], true);
		$userName  = validateUserName($_REQUEST['userName']);
		$email     = validateEmail($_REQUEST['email']);
		$role      = validateRole($_REQUEST['role']);
		$spec      = validateSpec($_REQUEST['spec'], $role);
		$projects  = validateProjects($_REQUEST['projects'], $role);
		$avatarId  = $_REQUEST['avatar_id'];

		$sql = '
			SELECT 
				* 
			FROM 
				users 
			WHERE 
				id = ?
		';
		$row = DB::get($sql, array($userId));

		if (!is_array($row)) {
			error('При сохранении пользователя произошла ошибка');
		}

		$changedParams = array();
		$changedParamValues = array();
		if ($avatarId != $row['avatar_id']) {
			$changedParams[] = 'avatar_id';
			$changedParamValues['avatar_id'] = $avatarId;
		}
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

		$sql = '
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
				u.id = ?
		';
		$rows = DB::select($sql, array($userId));

		
		$userId = $rows[0]['id'];
		if ($role < 3) {
			$sql = 'DELETE FROM users_projects WHERE user_id = ?';
			DB::execute($sql, array($userId));
		} else {
			$deleteSQL = 'DELETE FROM users_projects WHERE user_id = ? AND project_id = ?';
			$insertSQL = 'INSERT INTO users_projects VALUES ("", ?, ?)';
			$projectTokens = array();
			$projectsChanged = false;
			foreach ($rows as $pr) {
				if (!empty($pr['token'])) {
					if (!in_array($pr['token'], $projects)) {
						DB::execute(array($deleteSQL, $userId, $pr['pid']));
						$projectsChanged = true;
					}
					$projectTokens[] = $pr['token'];
				}
			}
			foreach ($projects as $pr) {
				if (!in_array($pr, $projectTokens)) {
					$sql = 'SELECT id FROM projects WHERE token = ?';
					$projectId = DB::get($sql, array($pr), 'id');
					if (!empty($projectId)) {
						DB::execute($insertSQL, array($userId, $projectId));
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
				$sql = 'SELECT * FROM users WHERE '.implode(' OR ', $where);
				$row = DB::get($sql, $whereParams);
				validateUniqueness($login, $password, $email, $row);
			}

			$setParams[] = $userId;
			$sql = 'UPDATE users SET '.implode(',', $set).' WHERE id = ?';
			DB::execute($sql, $setParams);
		} else if (!$projectsChanged) {
			error('Данные пользователя не поменялись');
		}
		success();		
	}

	static function getUserOfTeam($userId, $teamId) {
		$sql = 'SELECT * FROM users WHERE id = ? AND team_id = ?';
		return DB::get($sql, array($userId, $teamId));
	}

	static function getData() {
		$actor = Actor::get();
		$userId = $_REQUEST['userId'];
		if (empty($userId)) {
			error('Во время загрузки пользователя возникла ошибка');
		}
		$sql = '
			SELECT 
				u.id,
				u.avatar_id,
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
				u.id = ?
			AND
				u.team_id = ?
			GROUP BY u.id
		';
		$user = DB::get($sql, array($userId, $actor['team_id']));
		if (empty($user)) {
			noRightsError();
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

	static function loadWorkStatus() {
		$actor = Actor::get();
		$userId = $_REQUEST['id'];

		if ($actor['role_id'] < 5) {
			if (!empty($userId)) {
				$sql = '
					SELECT 
						id,
						name,
						avatar_id
					FROM 
						users
					WHERE 
						team_id = ?
					AND 
						id = ?
					AND 
						role >= ?
				';
				$user = DB::get($sql, array($actor['team_id'], $userId, $actor['role_id']));
				if (empty($user)) {
					noRightsError();
				}
			}
			$sql = '
				SELECT 
					id,
					name,
					avatar_id
				FROM 
					users
				WHERE  
					team_id = ?
				AND 
					role >= ?
				AND 
					id != ?
			';			
			$users = DB::select($sql, array($actor['team_id'], $actor['role_id'], $actor['id']));
			if (empty($users)) {
				$users = null;
			}
		} elseif (!empty($userId) && $userId != $actor['id']) {
			noRightsError();
		}
		if (empty($userId)) {
			$userId = $actor['id'];
		}
		$sql = '
			SELECT 
				work_status_id,
				reason
			FROM 
				user_work_statuses
			WHERE 
				user_id = ?
		';
		$row = DB::get($sql, array($userId));
		if (!empty($row)) {
			$workStatusId = $row['work_status_id'];
			$reason = $row['reason'];
		} else {
			$workStatusId = 2;
			$reason = '';
		}

		$usersDict = getDict('work_statuses');
		$dict = getDict('work_statuses');
		$statuses = array();
		$reasonShown = false;
		foreach ($dict['statuses'] as $id => $name) {
			$s = array('id' => $id, 'name' => $name);
			if ($workStatusId == $id) {
				$s['current'] = true;
				if ($workStatusId == 2) {
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
				'reason' => $reason,
				'users' => $users,
				'userId' => $userId
			)
		);
	}

	static function saveWorkStatus() {
		$actor = Actor::get();
		$status = $_REQUEST['status'];
		$reason = $_REQUEST['reason'];
		$userId = $_REQUEST['userId'];
		if (!empty($userId)) {
			if ($actor['role_id'] > 4) {
				noRightsError();
			}
			$sql = '
				SELECT 
					id
				FROM 
					users
				WHERE 
					id = ?
				AND 
					team_id = ?
				AND 
					role >= ?
			';
			$row = DB::get($sql, array($userId, $actor['team_id'], $actor['role_id']));
			if (empty($row)) {
				noRightsError();
			}
		} else {
			$userId = $actor['id'];
		}
		$sql = '
			INSERT INTO
				user_work_statuses
			VALUES (?, ?, ?)
			ON DUPLICATE KEY UPDATE 
			work_status_id = ?,
			reason = ?
		';
		DB::execute($sql, array($userId, $status, $reason, $status, $reason));
		success(null, 'Статус успешно изменен');		
	}

	static function block() {
		$actor = Actor::get();
		$userToken = validateUserIdAndRightsToEditUser('block');
		$sql = '
			SELECT 
				blocked_by 
			FROM 
				users
			WHERE 
				token = ?
			AND 
				team_id = ?
		';
		$row = DB::get($sql, array($userToken, $actor['team_id']));
		if (empty($row)) {
			noRightsError();	
		}
		$isBlocked = $row['blocked_by'] != null;
		$blockedBy = $isBlocked ? null : $actor['id'];
		$sql = '
			UPDATE 
				users
			SET 
				blocked_by = ?
			WHERE 
				token = ?
		';
		DB::execute($sql, array($blockedBy, $userToken));
		success();
	}

	static function doAction() {

	}

	static function getTasks() {
		requireClasses('task');
		Task::loadUserTasks();
	}

	static function getActions() {
		$id = $_REQUEST['id'];		
		$actions = array();
		$accessibleActions = array(
			'edit', 'assign', 'edit_tasks', 'set_status', 'call', 'review'
		);
		$allActions = $accessibleActions;

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
			'dict' => getDict('user_actions'),
			'user_id' => $id
		);
		success($data);
	}
}
