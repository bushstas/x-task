<?php

class Task {
	static function getTasks($user) {
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
						'.$sqlStatus.'
						'.$typeSql.'
						'.$impSql.'
					ORDER BY 
						t.importance_id ASC
				';
				$rows = DB::select($sql, $sqlParams);
			break;

			case 'my':
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
					'.$sqlStatus.'
					ORDER BY 
						t.importance_id ASC
				';
				$rows = DB::select($sql, array($user['id'], $user['id'], $user['project_id']));  
			break;

			case 'forme':
				array_unshift($sqlParams, $user['id']);
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
						'.$sqlStatus.'
						'.$typeSql.'
						'.$impSql.'
					ORDER BY 
						t.importance_id ASC
				';
				$rows = DB::select($sql, $sqlParams);
			break;
			
			default:
				array_unshift($sqlParams, $user['id'], $user['team_id']);
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
						'.$sqlStatus.'
						'.$typeSql.'
						'.$impSql.'
					ORDER BY 
						t.importance_id ASC
				';
				$rows = DB::select($sql, $sqlParams);  
		}
		
		
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

	static function getTaskForEditing($user) {
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
		$task = DB::get($sql, array($id, $user['team_id'], $user['role_id']));
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

	static function checkSubtask($taskId, $idx, $checked) {
		if ($checked) {
			$sql = 'INSERT INTO subtasks VALUES ("", ?, ?)';
			DB::execute($sql, array($taskId, $idx));
		} else {
			$sql = 'DELETE FROM subtasks WHERE task_id = ? AND idx = ?';
			DB::execute($sql, array($taskId, $idx));
		}
	}

	static function getTasksProgress($user) {
		requireClasses('project');
		$currentRelease = Project::getCurrentRelease($user);
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
		$rows = DB::select($sql, array($user['team_id'], $releaseId));
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

	static function getTasksCounts($user) {
		$counts = array();
		if ($user['role_id'] > 1) {
			$sql = '
				SELECT 
					COUNT(tu.id) AS count,
					t.id AS tid
				FROM 
					tasks_users tu
				JOIN tasks t
					ON t.id = tu.task_id 
						AND (t.status_id != 5 OR t.status_id IS NULL)
				WHERE
					tu.user_id = ?
				AND 
					tu.project_id = ?
			';
			
			$row = DB::get($sql, array($user['id'], $user['project_id']));
			$counts['forme'] = (int)$row['count'];
		} else {
			$counts['forme'] = 0;
		}

		if ($user['role_id'] < 6) {			
			$sql = '
				SELECT 
					COUNT(id) AS count
				FROM 
					tasks
				WHERE 
					(status_id < 5 OR status_id IS NULL) 
				AND 
					user_id = ?
				AND 
					project_id = ?
			';
			$row = DB::get($sql, array($user['id'], $user['project_id']));
			$counts['fromme'] = (int)$row['count'];
		} else {
			$counts['fromme'] = 0;
		}
		$sql = '
			SELECT
				COUNT(id) AS count
			FROM
				tasks
			WHERE
				(status_id < 5 OR status_id IS NULL)
			AND
				team_id = ?
			AND 
				project_id = ?
			AND 
				min_role >= ?
		';
		$row = DB::get($sql, array($user['team_id'], $user['project_id'], $user['role_id']));
		
		$counts['all'] = (int)$row['count'];

		$sql = '
			SELECT
				COUNT(id) AS count
			FROM
				tasks
			WHERE
				(status_id < 5 OR status_id IS NULL)
			AND
				(changed_by = ? OR for_user = ?)
			AND 
				project_id = ?
		';
		$row = DB::get($sql, array($user['id'], $user['id'], $user['project_id']));
		$counts['my'] = (int)$row['count'];
					
		return $counts;
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

	private static function getCurrentTaskInWork($user) {
		$sql = 'SELECT id FROM tasks WHERE status_id = 2 AND changed_by = ?';
		$task = DB::get($sql, array($user['id']));  
		if (is_array($task)) {
			return $task['id'];
		}
	}

	static function assignUserToTask($user) {
		$taskId = $_REQUEST['id'];
		$userId = $_REQUEST['userId'];

		$task = self::getTaskOfTeam($taskId, $user['team_id']);
		$usr  = User::getUserOfTeam($userId, $user['team_id']);
		if (empty($task['id']) || empty($usr['id'])) {
			noRightsError();
		}
		self::takeTask($usr, $taskId);
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

	static function takeTask($user, $id) {
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

	static function logTaskAction($id, $name, $user) {
		$sql = 'INSERT INTO tasks_history VALUES ("", ?, ?, (SELECT id FROM task_history_actions WHERE code = ?), ?)';
		DB::execute($sql, array($user['id'], $id, $name, strtotime('now')));
	}

	static function getUserTasks($user) {
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
		$tasks = DB::select($sql, array($userId, $user['team_id'], $userId));		
		return self::initTasks($tasks);
	}

	static function getAllTasksToDo($user) {
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
		$tasks = DB::select($sql, array($user['team_id']));
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
}