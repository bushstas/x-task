<?php

class Project {
	static function get($id) {
		$sql = '
			SELECT 
				p.*,
				pc.value AS color,
				r.id AS release_id,
				r.name AS release_name
			FROM 
				projects p 
			LEFT JOIN 
				project_colors pc
				ON p.color_id = pc.id
			LEFT JOIN 
				releases r
				ON p.id = r.project_id
			WHERE 
				p.id = ?
		';
		$row = DB::get($sql, array($id));

		return array(
			'id' => $row['id'],
			'token' => $row['token'],
			'name' => $row['name'],
			'color' => $row['color'],
			'releaseId' => $row['release_id'],
			'release' => $row['release_name']
		);
	}

	static function getCurrentRelease($user) {
		$sql = 'SELECT * FROM releases WHERE project_id = ?';
		return DB::get($sql, array($user['project_id']));
	}

	static function getNextTaskNumber($releaseId) {
		$sql = 'SELECT idn FROM tasks WHERE release_id = ? ORDER BY idn DESC';
		$row = DB::get($sql, array($releaseId));
		return $row['idn'] + 1;
	}

	static function getProjectsIds($projects) {
		if (!is_array($projects)) {
			return array();
		}
		$projects = '"'.implode('","', $projects).'"';
		$sql = 'SELECT id FROM projects WHERE token IN ('.$projects.')';
		$rows = DB::select($sql);
		$ids = array();
		foreach ($rows as $row) {
			$ids[] = $row['id'];
		}
		return $ids;
	}

	static function create($user) {
		if ($user['role'] != 'head' && $user['role'] != 'admin') {
			noRightsError();
		}

		$userId = $user['id'];
		$name = $_REQUEST['projectName'];
		if (empty($name)) {
			error('Введите название проекта');
		}
		$sql = '
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
		';
		$row = DB::get($sql, array($userId, $name));
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
		$sql = '
			INSERT INTO  
				projects
			VALUES( 
				"", ?, ?
			)
		';
		DB::execute($sql, array($name, $token));

		$sql = '
			SELECT 
				id
			FROM 
				projects
			WHERE 
				token = ?
		';
		$row = DB::get($sql, array($token));
		if (!is_array($row)) {
			error('При создании проекта произошла ошибка');
		}
		$sql = '
			INSERT INTO  
				users_projects
			VALUES( 
				"", ?, ?
			)
		';
		DB::execute($sql, array($userId, $row['id']));
		success(array(
			'token' => $token
		));		
	}

	static function set($user) {
		$projectId = $_REQUEST['id'];
		$userId = $user['id'];
		$sql = '
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
		';
		$row = DB::get($sql, array($projectId));
		
		if (is_array($row)) {
			$teamId = $row['team_id'];
			if ($teamId != $user['team_id']) {
				noRightsError();
			}
			$sql = '
				UPDATE 
					users
				SET 
					project_id = ?
				WHERE 
					id = ?
			';
			DB::execute($sql, array($projectId, $userId));
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
}