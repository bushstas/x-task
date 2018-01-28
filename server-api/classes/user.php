<?php

class User {
	static function get($token) {
		$sql = '
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
		';
		return DB::get($sql, array($token));
	}

	static function logout($token) {
		$sql = '
			DELETE FROM
				sessions
			WHERE 
				token = ?
		';
		DB::execute($sql, array($token));
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

	static function register($user = null) {
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
		$team = $byAdmin ? $user['team_id'] : null;
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
		$avatarId = getRandomAvatar($team);		
		DB::execute($sql, array($userName, $email, $token, $login, md5($password), $role, $spec, $team, $avatarId));

		$sql = '
			SELECT 
				id
			FROM 
				users 
			WHERE 
				token = ?
		';
		$row = DB::get($sql, array($token));
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

	static function load($user) {
		$projects = self::getProjects($user['id']);
		$data = array(
			'user' => $user,
			'rights' => self::getRights($user['role'])
		);
		if (count($projects) > 0) {
			if (!empty($user['project'])) {
				$currentProjectToken = $user['project'];
				$data['project'] = self::getProject($user['project']);
			}
			if (empty($data['project'])) {
				$currentProjectToken = $projects[0]['token'];
				$data['project'] = self::getProject($projects[0]['token']);
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
			$session = DB::get($sql, array($userId));
			
			if (is_array($session)) {
				$token = $session['token'];
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
}
