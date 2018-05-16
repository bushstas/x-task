<?php

class Task {
	static function getTaskId() {
		$actor = Actor::get();
		$idn = $_REQUEST['idn'];
		$sql = 'SELECT id FROM tasks WHERE team_id = ? AND idn = ?';
		$task = DB::get($sql, array($actor['team_id'], $idn));
		if (empty($task)) {
			noRightsError();
		}
		success(array(
			'id' => $task['id']
		));
	}

	static function getTaskInfo() {
		$actor = Actor::get();
		$id = $_REQUEST['id'];
		$sql = '
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
		';
		$task = DB::get($sql, array($id));
		$task['locked'] = $task['locked'] == 1;

		$data = json_decode($task['data'], true);
		foreach ($data as $k => $v) {
			if (empty($task[$k])) {
				$task[$k] = $v;
			}
		}
		unset($task['data']);

		$sql = '
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
		';
		$taskUsers = DB::select($sql, array($id));

		$sql = '
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
		';
		$taskTesters = DB::select($sql, array($id));

		$users = array(
			'author' => array('id' => $task['user_id'], 'avatar_id' => $task['avatar_id'], 'name' => $task['user_name']),
			'executors' => array(),
			'testers' => array()
		);
		$actions = $task['user_id'] == $actor['id'];
		foreach ($taskUsers as $usr) {
			if ($usr['user_id'] == $actor['id']) {
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

		$sql = '
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
		';
		$taskActions = DB::select($sql, array($id));

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
		$sql = '
			SELECT 
				*
			FROM 
				subtasks
			WHERE 
				task_id = ?
		';
		$subtasks = DB::select($sql, array($id));
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
			$sql = '
				SELECT 
					period
				FROM 
					tasks_periods
				WHERE 
					task_id = ?
			';
			$taskPeriod = DB::get($sql, array($id));

			$task['added'] += strtotime('now') - $lastAction['changed'];
			$task['timeleft'] = getFormattedDate($taskPeriod['period'], 'in_work');
			$task['timepassed'] = getFormattedDate(time() - $task['added'] - $taskPeriod['period'], 'waited');
		} else {
			extract(Task::getTaskTimeLeft($task['timeleft'], $task['locked'] === true ? $task['added'] : null));
			$task['timeleft'] = $timeleft;
			$task['overdue'] = $overdue;
			if ($task['locked']) {
				$task['timepassed']	= '';
			} else {
				$task['timepassed'] = getFormattedDate(time() - $task['added'], 'passed');
			}
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
			'id' => $task['id'],
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
			'own' => $task['changed_by'] == $actor['id'] || $task['user_id'] == $actor['id']
		));	
	}

	static function get() {
		$actor = Actor::get();
		$filter = $_REQUEST['filter'];
		$status = $_REQUEST['status'];
		$release = $_REQUEST['release'];
		if ($status[0] == '[') {
			$status = json_decode($status, true);
		}
		$type = $_REQUEST['type'];
		$importance = $_REQUEST['importance'];

		if (empty($filter)) {
			$filter = 'fromme';
			switch ($actor['role']) {
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
			$actor['project_id'],
			$actor['role_id']
		);
		$sqlRelease = '';
		if (empty($release)) {
			$release = $actor['release_id'];
		}
		if ($release == 'none') {
			$release = null;
		}
		if (!empty($release)) {
			$sqlRelease = ' AND t.release_id = ?';
			$sqlParams[] = $release;
		}
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

		if ($actor['role_id'] < 4) {
			$actor['role_id'] = 0;
		}

		switch ($filter) {
			case 'fromme':
				array_unshift($sqlParams, $actor['id']);
				$sql = '
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
						'.$sqlRelease.'
						'.$sqlStatus.'
						'.$typeSql.'
						'.$impSql.'
					ORDER BY 
						t.importance_id ASC
				';
				$rows = DB::select($sql, $sqlParams);
			break;

			case 'my':
				$sqlParams = array(
					$actor['id'],
					$actor['id'],
					$actor['project_id']
				);
				if (!empty($release)) {				
					$sqlParams[] = $release;
				}
				$sql = '
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
					'.$sqlRelease.'
					'.$sqlStatus.'
					ORDER BY 
						t.importance_id ASC
				';
				$rows = DB::select($sql, $sqlParams);  
			break;

			case 'forme':
				array_unshift($sqlParams, $actor['id']);
				$sql = '
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
						'.$sqlRelease.'
						'.$sqlStatus.'
						'.$typeSql.'
						'.$impSql.'
					ORDER BY 
						t.importance_id ASC
				';
				$rows = DB::select($sql, $sqlParams);
			break;
			
			default:
				array_unshift($sqlParams, $actor['id'], $actor['team_id']);
				$sql = '
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
						'.$sqlRelease.'
						'.$sqlStatus.'
						'.$typeSql.'
						'.$impSql.'
					ORDER BY 
						t.importance_id ASC
				';
				$rows = DB::select($sql, $sqlParams);  
		}
		
		
		$tasks = array();
		if ($actor['role_id'] < 5) {
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
			if ($actor['role_id'] > 4 && 
				(($filter == 'all' && empty($row['task_user'])) || 
				!empty($row['changed_by']) && $row['changed_by'] != $actor['id'])
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
				extract(self::getTaskTimeLeft($row['until_timestamp']));
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

	static function getTaskForEditing() {
		$actor = Actor::get();
		$id = $_REQUEST['id'];
		$sql = '
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
		';
		$task = DB::get($sql, array($id, $actor['team_id'], $actor['role_id']));
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

	static function getTasksProgress() {
		$actor = Actor::get();
		requireClasses('project');
		$currentRelease = Project::getCurrentRelease();
		$releaseId = $currentRelease['id'];
		$sql = '
			SELECT 
				*
			FROM 
				tasks
			WHERE
				team_id = ?
			AND 
				release_id = ?
		';
		$rows = DB::select($sql, array($actor['team_id'], $releaseId));
		$all = 0;
		$undone = 0;
		$done = 0;
		foreach ($rows as $row) {
			$all++;
			if ($row['status_id'] == 5)	 {
				$done++;
			} else {
				$undone++;
			}
		}
		return array(
			'all' => $all,
			'done' => $done,
			'undone' => $undone
		);
	}

	static function getCounts() {
		$actor = Actor::get();
		$release = $_REQUEST['release'];
		$sqlParams = array(
			$actor['id'],
			$actor['project_id']
		);
		$sqlRelease = '';
		if (empty($release)) {
			$release = $actor['release_id'];
		}
		if ($release == 'none') {
			$release = null;
		}
		if (!empty($release)) {
			$sqlRelease = ' AND t.release_id = ?';
			$sqlParams[] = $release;
		}
		$counts = array();
		if ($actor['role_id'] > 1) {
			$sql = '
				SELECT 
					COUNT(tu.id) AS count,
					t.id AS tid
				FROM 
					tasks_users tu
				JOIN tasks t
					ON t.id = tu.task_id 
						AND (t.status_id != 5 OR t.status_id IS NULL)
						'.$sqlRelease.'
				WHERE
					tu.user_id = ?
				AND 
					tu.project_id = ?
			';			
			$row = DB::get($sql, $sqlParams);
			$counts['forme'] = (int)$row['count'];
		} else {
			$counts['forme'] = 0;
		}

		if ($actor['role_id'] < 6) {			
			$sql = '
				SELECT 
					COUNT(id) AS count
				FROM 
					tasks t
				WHERE 
					(t.status_id < 5 OR t.status_id IS NULL) 
				AND 
					t.user_id = ?
				AND 
					t.project_id = ?
				'.$sqlRelease.'
			';
			$row = DB::get($sql, $sqlParams);
			$counts['fromme'] = (int)$row['count'];
		} else {
			$counts['fromme'] = 0;
		}
		
		$sqlParams = array(
			$actor['team_id'],
			$actor['project_id'],
			$actor['role_id']
		);
		if (!empty($release)) {
			$sqlParams[] = $release;
		}
		$sql = '
			SELECT
				COUNT(id) AS count
			FROM
				tasks t
			WHERE
				(t.status_id < 5 OR t.status_id IS NULL)
			AND
				t.team_id = ?
			AND 
				t.project_id = ?
			AND 
				t.min_role >= ?
			'.$sqlRelease.'
		';
		$row = DB::get($sql, $sqlParams);		
		$counts['all'] = (int)$row['count'];

		
		$sqlParams = array(
			$actor['id'],
			$actor['id'],
			$actor['project_id']
		);
		if (!empty($release)) {
			$sqlParams[] = $release;
		}
		$sql = '
			SELECT
				COUNT(id) AS count
			FROM
				tasks t
			WHERE
				(t.status_id < 5 OR t.status_id IS NULL)
			AND
				(t.changed_by = ? OR t.for_user = ?)
			AND 
				t.project_id = ?
			'.$sqlRelease.'
		';
		$row = DB::get($sql, $sqlParams);
		$counts['my'] = (int)$row['count'];
					
		success(array(
			'counts' => $counts,
			'progress' => self::getTasksProgress()
		));
	}

	static function getTaskTimeLeft($timeleft, $time = null) {
		if (empty($time)) {
			$time = time();
		}
		$diff = $timeleft - $time;
		$left = 'left';
	    $overdue = false;
	    if ($diff < 0) {
	    	$diff = -$diff;
	    	$left = 'overdue';
	    	$overdue = true;
	    }
	    return array(
	    	'overdue' => $overdue,
	    	'timeleft' => getFormattedDate($diff, $left)
	    );
	}

	private static function getCurrentTaskInWork() {
		$actor = Actor::get();
		$sql = 'SELECT id FROM tasks WHERE status_id = 2 AND changed_by = ?';
		$task = DB::get($sql, array($actor['id']));  
		if (is_array($task)) {
			return $task['id'];
		}
	}

	static function doAction() {
		$id = $_REQUEST['id'];
		$name = $_REQUEST['name'];
		$actions = getAccessableTaskActions($id);
		if (!in_array($name, $actions)) {
			noRightsError();
		}
		switch ($name) {
			case 'continue':
			case 'take':
				Task::takeTask($id);
			break;

			case 'delay':
				Task::logTaskInWorkTime($id);
				Task::delayTask($id);
			break;

			case 'complete':
				Task::logTaskInWorkTime($id);
				Task::completeTask($id);
			break;

			case 'resume':
				Task::resumeTask($id);
			break;

			case 'refuse':
				Task::logTaskInWorkTime($id);
				Task::refuseTask($id);
			break;

			case 'close':
				Task::closeTask($id);
			break;

			case 'unblock':
				Task::unblockTask($id);
			break;

			case 'freeze':
				Task::freezeTask($id);
			break;

			case 'unfreeze':
				Task::unfreezeTask($id);
			break;

			case 'open':
				Task::openTask($id);
			break;

			case 'remove':
				Task::removeTask($id);
				success();
			break;
		}
		Task::logTaskAction($id, $name);
		success();
	}

	static function assign() {
		$actor = Actor::get();
		$taskId = $_REQUEST['id'];
		$userId = $_REQUEST['userId'];

		$task = self::getTaskOfTeam($taskId, $actor['team_id']);
		$usr  = User::getUserOfTeam($userId, $actor['team_id']);
		if (empty($task['id']) || empty($usr['id'])) {
			noRightsError();
		}
		self::takeTask($taskId, $usr);
	}

	static function getTaskOfTeam($taskId, $teamId) {
		$sql = 'SELECT * FROM tasks WHERE id = ? AND team_id = ?';
		return DB::get($sql, array($taskId, $teamId));
	}

	static function removeTask($id) {
		$sql = 'DELETE FROM tasks_users WHERE task_id = ?';
		DB::execute($sql, array($id));

		$sql = 'DELETE FROM tasks_testers WHERE task_id = ?';
		DB::execute($sql, array($id));

		$sql = 'DELETE FROM tasks_periods WHERE task_id = ?';
		DB::execute($sql, array($id));

		$sql = 'DELETE FROM tasks_history WHERE task_id = ?';
		DB::execute($sql, array($id));

		$sql = 'DELETE FROM subtasks WHERE task_id = ?';
		DB::execute($sql, array($id));

		$sql = 'DELETE FROM frozen_tasks WHERE task_id = ?';
		DB::execute($sql, array($id));

		$sql = 'DELETE FROM tasks WHERE id = ?';
		DB::execute($sql, array($id));
	}

	static function unblockTask($id) {
		$sql = 'UPDATE tasks SET locked = 0, added = ? WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $id));
	}

	static function freezeTask($id) {
		$sql = 'SELECT importance_id FROM tasks WHERE id = ?';
		$row = DB::get($sql, array($id));
		
		$sql = 'INSERT INTO frozen_tasks VALUES (?, ?, ?)';
		DB::execute($sql, array($id, $row['importance_id'], strtotime('now')));
		
		$sql = 'UPDATE tasks SET changed = ?, status_id = 4, importance_id = 6 WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $id));
	}

	static function unfreezeTask($id) {	
		$sql = 'SELECT importance_id, frozen FROM frozen_tasks WHERE task_id = ?';
		$row = DB::get($sql, array($id));
		$diff = strtotime('now') - $row['frozen'];

		$sql = 'DELETE FROM frozen_tasks WHERE task_id = ?';
		DB::execute($sql, array($id));
		
		$sql = 'UPDATE tasks SET changed = ?, status_id = NULL, importance_id = ?, until_timestamp = until_timestamp + ? WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $row['importance_id'], $diff, $id));
	}

	static function closeTask($id) {
		$sql = 'UPDATE tasks SET changed = ?, status_id = 5 WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $id));
	}

	static function openTask($id) {
		$sql = 'UPDATE tasks SET changed = ?, status_id = NULL WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $id));
	}

	static function completeTask($id) {
		$sql = 'UPDATE tasks SET changed = ?, status_id = 1 WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $id));
	}

	static function resumeTask($id) {
		$sql = 'UPDATE tasks SET changed = ?, status_id = 2 WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $id));
	}

	static function refuseTask($id) {
		$sql = 'UPDATE tasks SET changed = added, changed_by = NULL, status_id = NULL WHERE id = ?';
		DB::execute($sql, array($id));
	}

	static function takeTask($id, $user = null) {
		if (empty($user)) {
			$user = Actor::get();
		}
		$currentTaskId = self::getCurrentTaskInWork($user);
		if (!empty($currentTaskId)) {
			self::delayTask($currentTaskId);
		}
		$sql = 'UPDATE tasks SET changed = ?, changed_by = ?, status_id = 2 WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $user['id'], $id));
	}

	static function delayTask($id) {
		$sql = 'UPDATE tasks SET changed = ?, status_id = 3 WHERE id = ?';
		DB::execute($sql, array(strtotime('now'), $id));
	}

	static function logTaskInWorkTime($id) {
		$sql = 'SELECT changed FROM tasks WHERE status_id = 2 AND id = ?';
		$task = DB::get($sql, array($id));
		
		if (is_array($task)) {
			$now = strtotime('now');
			$period = $now - $task['changed'];
		}
		$sql = 'SELECT period FROM tasks_periods WHERE task_id = ?';
		$taskPeriod = DB::get($sql, array($id));
		
		if (is_array($taskPeriod)) {
			$period += (int)$taskPeriod['period'];
		}
		$sql = 'INSERT INTO tasks_periods VALUES (?, ?) ON DUPLICATE KEY UPDATE period = ?';
		DB::execute($sql, array($id, $period, $period));
	}

	static function logTaskAction($id, $name) {
		$actor = Actor::get();
		$sql = 'INSERT INTO tasks_history VALUES ("", ?, ?, (SELECT id FROM task_history_actions WHERE code = ?), ?)';
		DB::execute($sql, array($actor['id'], $id, $name, strtotime('now')));
	}

	static function getUserTasks() {
		$actor = Actor::get();
		$userId = $_REQUEST['userId'];
		$sql = '
			SELECT 
				t.*,
				tt.code AS type,
				ta.code AS action,
				ti.code AS importance,
				ts.code AS status,
				tp.period,
				u.name AS user_name,
				u.avatar_id
			FROM 
				tasks_users tu
			JOIN 
				tasks t
				ON t.id = tu.task_id
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
			WHERE 
				tu.user_id = ?
			AND 
				tu.team_id = ?
			AND
				(t.status_id IS NULL OR (t.changed_by = ? AND t.status_id = 3))
		';
		$tasks = DB::select($sql, array($userId, $actor['team_id'], $userId));		
		return self::initTasks($tasks);
	}

	static function getAllTasksToDo() {
		$actor = Actor::get();
		$sql = '
			SELECT 
				t.*,
				tt.code AS type,
				ta.code AS action,
				ti.code AS importance,
				ts.code AS status,
				tp.period,
				u.name AS user_name,
				u.avatar_id
			FROM 
				tasks t
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
			WHERE
				t.team_id = ?
			AND
				(t.status_id IS NULL OR t.status_id = 3)
		';
		$tasks = DB::select($sql, array($actor['team_id']));
		return self::initTasks($tasks);
	}

	private static function initTasks($tasks) {
		$dict = getDict('task');
		foreach ($tasks as &$task) {
			$task['locked'] = $task['locked'] == 1;
			
			if (empty($task['status'])) {
				if (!empty($task['locked'])) {
					$task['status'] = 'locked';
				} else {
					$task['status'] = 'current';
				}
			}
			if ($task['status'] == 'in_work' && !empty($task['period'])) {
				$task['changed'] -= $task['period'];
			}
			if ($task['status'] == 'current' || $task['status'] == 'in_work') {
				extract(Task::getTaskTimeLeft($task['until_timestamp']));
				$task['timeleft'] = $timeleft;
				$task['overdue'] = $overdue;
			}
			$ago = $task['status'] != 'in_work' ? 'ago' : '';
			$task['changed'] = $dict[$task['status']].' '.getFormattedDate(time() - $task['changed'], $ago);
		}
		return $tasks;
	}

	static function loadActions() {
		$id = $_REQUEST['id'];
		$accessibleActions = getAccessableTaskActions($id);
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

	static function loadUserTasks() {
		$userTasks = self::getUserTasks();
		$allTasks = self::getAllTasksToDo();
		$ids = array();
		foreach ($userTasks as $task) {
			$ids[] = $task['id'];
		}
		$otherTasks = array();
		foreach ($allTasks as $task) {
			if (!in_array($task['id'], $ids)) {
				$otherTasks[] = $task;
			}
		}
		success(array(
			'tasks' => $userTasks,
			'otherTasks' => $otherTasks,
			'dict' => getDict('user_tasks')
		));
	}

	static function save() {
		$data = json_decode($_REQUEST['data'], true);
		if (!is_array($data)) {
			unknownError();
		}
		extract($data);
		$isEditing = !empty($task_id);

		Rights::check($isEditing ? 'edit_task' : 'add_task');
		$actor = Actor::get();		
		$noExecs = false;
		if ($isEditing) {
			$sql = '
				SELECT 
					status_id
				FROM 
					tasks
				WHERE 
					id = ?
				AND 
					team_id = ?
			';
			$row = DB::get($sql, array($task_id, $actor['team_id']));
			if (empty($row)) {
				noRightsError();
			}
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
				$users = self::getExecutors($type, $action);
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
			$sql = 'SELECT id, role FROM users WHERE token IN ('.$tokens.')';
			$userRows = DB::select($sql);
			$minRole = 0;
			$forUser = 0;
			if (count($userRows) == 1) {
				$forUser = $userRows[0]['id'];
			}
			foreach ($userRows as $row) {
				if ($row['role'] <= $actor['role_id']) {
					noRightsError();
				}
				if ($row['role'] > $minRole) {
					$minRole = $row['role'];
				}
			}	
			$lockedTask = $lockedTask ? 1 : 0;
		}

		if (!$isEditing) {
			requireClasses('project');
			$currentRelease = Project::getCurrentRelease();
			$idn = Project::getNextTaskNumber($currentRelease['id']);
			$taskToken = generateToken(6);
			$changed = strtotime('now');
			$untilTimestamp = getUntilTimestamp($until);
			$sql = '
				INSERT INTO
					tasks
				VALUES (
					"",
					?,
					?,
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
			';
			DB::execute($sql, array(
				$idn,
				$actor['team_id'],
				$actor['id'],
				$actor['project_id'],
				$currentRelease['id'],
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

			$sql = '
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
			';
			$row = DB::get($sql, array($taskToken, $actor['id']));
			if (!is_array($row)) {
				unknownError();	
			}
			$taskId = $row['id'];
		} else {
			$taskId = $task_id;
			if (!$noExecs) {
				$sql = '
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
				';
				DB::execute($sql, array(
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

				$sql = 'DELETE FROM tasks_users WHERE task_id = ?';
				DB::execute($sql, array($taskId));
				$sql = 'DELETE FROM tasks_testers WHERE task_id = ?';
				DB::execute($sql, array($taskId));
			} else {
				$sql = '
					UPDATE
						tasks
					SET
						data = ?
					WHERE 
						id = ?
				';
				DB::execute($sql, array(
					$data,
					$task_id
				));
			}
		}

		if (!$noExecs) {
			$sql = 'INSERT INTO tasks_users VALUES ("", ?, ?, ?, ?)';
			foreach ($userRows as $row) {
				DB::execute($sql, array($taskId, $actor['team_id'], $row['id'], $actor['project_id']));
			}

			if (!empty($testers)) {
				$tokens = '"'.implode('","', $testers).'"';
				$sql = 'SELECT id, role FROM users WHERE token IN ('.$tokens.')';
				$userRows = DB::select($sql);
				$sql = 'INSERT INTO tasks_testers VALUES ("", ?, ?, ?, ?)';
				foreach ($userRows as $row) {
					DB::execute($sql, array($taskId, $actor['team_id'], $row['id'], $actor['project_id']));
				}
			}
		}

		success(null, !$isEditing ? 'Задача успешно добавлена' : 'Задача успешно сохранена');
	}

	private static function getExecutors($taskType, $taskAction) {
		$actor = Actor::get();
		$sql = '
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
		';
		$rows = DB::select($sql, array($actor['team_id'], $actor['role_id']));
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

	static function getTaskUsers() {
		$dict = getDict('task_users_dialog');
		$dict['users'] = self::getExecutors($_REQUEST['type'], $_REQUEST['taskAction']);
		success(array(
			'dict' => $dict
		));
	}

	static function getTerms() {
		$dict = getDict('task_terms');
		$sql = 'SELECT * FROM task_terms ORDER BY id ASC';
		$terms = DB::select($sql);
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

	static function checkSubtask() {
		$actor = Actor::get();
		$id = $_REQUEST['id'];
		$idx = $_REQUEST['idx'];
		$checked = $_REQUEST['checked'];
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
		$row = DB::get($sql, array($id, $actor['id'], $actor['id']));
		if (!is_array($row)) {
			noRightsError();
		}
		if ($checked) {
			$sql = 'INSERT INTO subtasks VALUES ("", ?, ?)';
			DB::execute($sql, array($id, $idx));
		} else {
			$sql = 'DELETE FROM subtasks WHERE task_id = ? AND idx = ?';
			DB::execute($sql, array($id, $idx));
		}
		success();
	}
}