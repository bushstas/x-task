<?php

class Board {
	static function getTasks($user) {
		$filter = $_REQUEST['filter'];

		$dict = getDict('board');
		$tasksDict = getDict('task');
		$sql = '
			SELECT 
				t.*,
				tt.code AS type,
				ta.code AS action,
				ti.code AS importance,
				ts.code AS status,
				u.name AS user_name,
				u.id AS user_id,
				u.avatar_id,
				u2.name AS user_name2,
				u2.id AS user_id2,
				u2.avatar_id AS avatar_id2
			FROM 
				tasks t
			LEFT JOIN task_types tt
				ON tt.id = t.type_id
			LEFT JOIN task_actions ta
				ON ta.id = t.action_id
			LEFT JOIN task_importance ti
				ON ti.id = t.importance_id
			LEFT JOIN task_statuses ts
				ON ts.id = t.status_id
			LEFT JOIN users u
				ON u.id = t.changed_by
			JOIN users u2
				ON u2.id = t.user_id
			WHERE 
				t.team_id = ?
			AND 
				(t.status_id < 5 OR t.status_id IS NULL)
			ORDER BY importance_id
		';
		$rows = DB::select($sql, array($user['team_id']));
		if ($filter == 'type') {
			$tasks = array(
				'design' => array(),
				'prototype' => array(),
				'text' => array(),
				'html' => array(),
				'style' => array(),
				'frontend' => array(),
				'backend' => array(),
				'test' => array(),
				'page' => array(),
				'project' => array()
			);


			if ($user['role_id'] < 5) {
				$statuses = array(
					'ready',
					'in_work',
					'locked',
					'current',
					'delayed',
					'frozen'
				);
			} else {
				$statuses = array(
					'current',
					'locked',
					'in_work',
					'ready',
					'delayed',
					'frozen'
				);
			}
			foreach ($tasks as &$list) {
				foreach ($statuses as $s) {
					$list[$s] = array();
				}
			}


		} else {
			$tasks = array(
				'current' => array(),
				'in_work' => array(),
				'delayed' => array(),
				'ready' => array(),
				'frozen' => array(),
			);
		}
		foreach ($rows as &$row) {
			if (empty($row['status'])) {
				$row['status'] = 'current';
			}
			$ago = $row['status'] != 'in_work' ? 'ago' : '';
			$row['changed'] = $tasksDict[$row['status']].' '.getFormattedDate(time() - $row['changed'], $ago);
			if (empty($row['user_id'])) {
				$row['user_id'] = $row['user_id2'];
				$row['user_name'] = $row['user_name2'];
				$row['avatar_id'] = $row['avatar_id2'];
			}
			unset($row['user_id2'], $row['user_name2'], $row['avatar_id2']);
			
			if ($filter == 'type') {
				$tasks[$row['type']][$row['status']][] = $row;
			} else {
				if (empty($row['status_id'])) {
					$tasks['current'][] = $row;
				} elseif ($row['status_id'] == 1) {
					$tasks['ready'][] = $row;
				} elseif ($row['status_id'] == 2) {
					$tasks['in_work'][] = $row;
				} elseif ($row['status_id'] == 3) {
					$tasks['delayed'][] = $row;
				} elseif ($row['status_id'] == 4) {
					$tasks['frozen'][] = $row;
				}
			}
		}

		if ($filter == 'type') {
			$properTasks = array();
			foreach ($tasks as $k => $list) {
				$arr = array();
				foreach ($list as $l) {
					$arr = array_merge($arr, $l);
				}
				$properTasks[$k] = $arr;
			}			
			$tasks = $properTasks;
		}
		
		return array(
			'dict' => $dict,
			'tasks' => $tasks,
			'order' => array_keys($tasks)
		);
	}
}