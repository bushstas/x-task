<?php

class Task {
	static function getTasks() {

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

	static function getTaskTimeLeft($timeleft) {
		$diff = $timeleft - time();
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
}