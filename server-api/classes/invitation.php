<?php

class Invitation {
	static function getInvitationProject($token) {
		$sql = '
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
		';
		$rows = DB::select($sql, array($token));
		$projects = array();
		foreach ($rows as $row) {
			$projects[] = $row['token'];
		}
		return $projects;
	}

	static function get($user, $refreshing) {
		$sql = '
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
		';
		$invitations = DB::select($sql, array($user['team_id']));
		success(array(
			'invitations' => $invitations
		));
	}

	static function getData($user) {
		$token = $_REQUEST['invToken'];
		if (empty($token)) {
			error('Во время загрузки приглашения возникла ошибка');
		}
		if ($user['role_id'] > 4) {
			noRightsError();
		}
		$sql = '
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
			AND 
				i.team_id = ?
			GROUP BY i.id
		';
		$invitation = DB::get($sql, array($token, $user['team_id']));
		if (empty($invitation)) {
			noRightsError();
		}
		success(array(
			'invitation' => $invitation
		));		
	}

	static function create() {
		requireClasses('project');
		$actor = Actor::get();
		
		$title = validateTitle($_REQUEST['name']);
		$role = validateRole($_REQUEST['role']);
		$projects = Project::getProjectsIds(validateProjects($_REQUEST['projects'], $role));
		$token = generateUniqueToken('invitations');
		validateInvitationTokenAndRights($role, $token);
		
		$sql = '
			INSERT INTO
				invitations
			VALUES ("", ?, ?, ?, ?)
		';
		DB::execute($sql, array($actor['team_id'], $title, $token, $role));
		
		$sql = '
			SELECT 
				id
			FROM 
				invitations
			WHERE 
				token = ?
		';
		$id = DB::get($sql, array($token), 'id');
		if (empty($id)) {
			unknownError();
		}
		$sql = '
			INSERT INTO
				invitations_projects
			VALUES ("", ?, ?)
		';
		foreach ($projects as $projectId) {
			DB::execute($sql, array($id, $projectId));
		}
		success();
	}

	static function save() {
		$role      = validateRole($_REQUEST['role']);
		$title     = validateTitle($_REQUEST['name']);
		$projects  = Project::getProjectsIds(validateProjects($_REQUEST['projects'], $role));
		$invToken  = validateInvitationTokenAndRights($role, $_REQUEST['invToken']);	

		$sql = '
			UPDATE 
				invitations
			SET
				name = ?, role_id = ?
			WHERE 
				token = ?
		';
		DB::execute($sql, array($title, $role, $invToken));

		$sql = 'DELETE FROM invitations_projects WHERE ';
		success();
	}
}