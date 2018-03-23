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
}