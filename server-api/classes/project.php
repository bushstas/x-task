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
}