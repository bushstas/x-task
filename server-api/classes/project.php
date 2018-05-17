<?php

class Project {
	static function get() {
		$actor = Actor::get();
		$sql = '
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
		';
		$projects = DB::select($sql, array($actor['team_id']));
		foreach ($projects as &$project) {
			if ($project['id'] == $actor['project_id']) {
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

	static function getProjectData($id) {
		$actor = Actor::get();
		$sql = '
			SELECT 
				p.id,
				p.name,
				pc.value AS color,
				r.id AS release_id,
				r.name AS release_name,
				r.date AS release_date,
				r.active AS release_active
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
			AND
				p.team_id = ?
		';
		$row = DB::get($sql, array($id, $actor['team_id']));
		if (empty($row)) {
			return null;
		}
		$date = date('d.m.y', strtotime($row['release_date']));

		return array(
			'id' => $row['id'],
			'name' => $row['name'],
			'color' => $row['color'],
			'release' => array(
				'id' => $row['release_id'],			
				'name' => $row['release_name'],
				'date' => $date,
				'active' => $row['release_active'] == 1
			)
		);
	}

	static function getData() {
		$project = self::getProjectData($_REQUEST['id']);
		if (empty($project)) {
			noRightsError();
		}
		success($project);
	}

	static function getCurrentRelease() {
		$actor = Actor::get();
		$sql = 'SELECT * FROM releases WHERE project_id = ?';
		return DB::get($sql, array($actor['project_id']));
	}

	static function getNextTaskNumber($releaseId) {
		$sql = 'SELECT idn FROM tasks WHERE release_id = ? ORDER BY idn DESC';
		$row = DB::get($sql, array($releaseId));
		return $row['idn'] + 1;
	}

	static function getProjectsIds($projects) {
		$actor = Actor::get();
		if (!is_array($projects)) {
			return array();
		}
		$count = count($projects);
		$projects = '"'.implode('","', $projects).'"';
		$sql = '
			SELECT 
				id
			FROM
				projects
			WHERE
				token IN ('.$projects.')
			AND 
				team_id = ?
		';
		$rows = DB::select($sql, array($actor['team_id']));
		if (count($rows) < $count) {
			noRightsError();
		}
		$ids = array();
		foreach ($rows as $row) {
			$ids[] = $row['id'];
		}
		return $ids;
	}

	static function create() {
		$actor = Actor::get();
		if ($actor['role'] != 'head' && $actor['role'] != 'admin') {
			noRightsError();
		}

		$userId = $actor['id'];
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

	static function set($projectId = null) {
		$actor = Actor::get();
		if (empty($projectId)) {
			$projectId = $_REQUEST['id'];
		}
		$project = self::getProjectData($projectId);
		
		if (!empty($project)) {
			$sql = '
				UPDATE 
					users
				SET 
					project_id = ?
				WHERE 
					id = ?
			';
			DB::execute($sql, array($projectId, $actor['id']));
			success(array('project' => $project));
		}
		noRightsError();
	}

	static function getEdited() {
		$actor = Actor::get();
		$token = $_REQUEST['projectToken'];
		if (empty($token)) {
			error('Во время загрузки проекта возникла ошибка');
		}
		if ($actor['role_id'] > 4) {
			noRightsError();
		}
		$sql = '
			SELECT 
				p.*
			FROM 
				projects p
			WHERE 
				p.token = ?
			AND 
				p.team_id = ?
		';
		$project = DB::get($sql, array($token, $actor['team_id']));
		if (empty($project)) {
			noRightsError();
		}
		success(array(
			'project' => $project,
			'dict' => Dict::getByName('projects')
		));
	}

	static function activate() {
		$actor = Actor::get();
		$projectToken = validateProjectToken();
		$project = validateProjectAccess($projectToken);
		$sql = '
			UPDATE 
				users
			SET
				project_id = ?
			WHERE 
				id = ? 
		';
		DB::execute($sql, array($project['id'], $actor['id']));
		success();
	}

	static function requestAccess() {
		$actor = Actor::get();
		$projectToken = validateProjectToken();
		$project = validateProjectAccess($projectToken);

		$sql = '
			SELECT 
				id
			FROM 
				users_projects
			WHERE 
				project_id = ? 
			AND
				user_id = ?
		';
		$record = DB::get($sql, array($project['id'], $actor['id']));
		if (!empty($record)) {
			error('Вам уже доступен данный проект');
		}
		$sql = 'INSERT INTO access_requests VALUES ("", ?, ?)';
		
		DB::execute($sql, array($actor['id'], $project['id']));
		success(
			null,
			'Запрос на получение доступа к проекту успешно добавлен'
		);
	}

	static function save() {
		$actor = Actor::get();
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
		
		$projectToken = validateTokenAndRightsToEditProject();
		validateProjectAccess($projectToken);
		$name  = validateTitle($_REQUEST['name']);

		$sql = '
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
		';
		$record = DB::get($sql, array($name, $actor['team_id'], $projectToken));
		if (is_array($record)) {
			error('Проект с таким именем уже существует');
		}

		$homepage  = validateHomepage($_REQUEST['homepage']);
		$sql = '
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
		';
		DB::execute($sql, array(
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

	static function getList() {
		$actor = Actor::get();
		$sql = 'SELECT id, name FROM projects WHERE team_id = ?';		
		$projects = DB::select($sql, array($actor['team_id']));
		foreach ($projects as &$p) {
			if ($p['id'] == $actor['project_id']) {
				$p['current'] = true;
			}
		}
		success(array(
			'projectsList' => $projects
		));
	}
}