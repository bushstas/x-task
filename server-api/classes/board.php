<?php

class Board {
	static function getTasks() {
		$actor = Actor::get();
		$filter = $_REQUEST['filter'];
		$projectId = $_REQUEST['projectId'];
		$filterUsers = $_REQUEST['users'];

		if (!empty($projectId)) {
			requireClasses('project');
			Project::set($projectId);
			$actor['project_id'] = $projectId;
		}

		if (!empty($filterUsers) && is_string($filterUsers)) {
			$filterUsers = explode(',', $filterUsers);
		} else {
			$filterUsers = array();
		}

		$userTasks = array();
		$userTasksData = array();
		$sql = '
			SELECT 
				tu.*,
				r.code AS role,
				s.code AS spec
			FROM 
				tasks_users tu
			LEFT JOIN 
				users u
				ON u.id = tu.user_id
			JOIN 
				roles r 
				ON u.role = r.id 
			LEFT JOIN 
				specs s 
				ON u.spec = s.id 
			WHERE 
				tu.project_id = ?
		';
		$rows = DB::select($sql, array($actor['project_id']));
		foreach ($rows as $row) {
			if (!is_array($userTasks[$row['task_id']])) {
				$userTasks[$row['task_id']] = array();
				$userTasksData[$row['task_id']] = array();
			}
			$userTasks[$row['task_id']][] = $row['user_id'];
			$userTasksData[$row['task_id']][] = $row;
		}


		$dict = getDict('board');
		$tasksDict = getDict('task');
		$sql = '
			SELECT 
				t.*,
				t.user_id AS author_id,
				tt.code AS type,
				ta.code AS action,
				ti.code AS importance,
				ts.code AS status,
				u.name AS user_name,
				u.id AS user_id,
				u.avatar_id,
				u2.name AS user_name2,
				u2.id AS user_id2,
				u2.avatar_id AS avatar_id2,
				tu.id AS task_user
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
			LEFT JOIN tasks_users tu
				ON t.id = tu.task_id AND tu.user_id = ?
			WHERE 
				t.team_id = ?
			AND 
				t.min_role >= ?
			AND 
				(t.status_id < 5 OR t.status_id IS NULL)
			AND 
				t.project_id = ?
			ORDER BY 
				t.importance_id
		';
		$rows = DB::select($sql, array($actor['id'], $actor['team_id'], $actor['role_id'], $actor['project_id']));

		$addedUsers = array();
		$filteredRows = array();
		foreach ($rows as $row) {
			$userId = $row['for_user'];
			if (empty($userId)) {
				$userId = $row['changed_by'];
			}
			if (!empty($userId) && !in_array($userId, $addedUsers)) {
				$addedUsers[] = $userId;
			}
			if (empty($filterUsers) || (!empty($userId) && in_array($userId, $filterUsers))) {
				$filteredRows[] = $row;
			} elseif ((empty($row['status']) || $row['status'] == 'frozen') && is_array($userTasks[$row['id']])) {
				$intersections = array_intersect($filterUsers, $userTasks[$row['id']]);
				if (!empty($intersections)) {
					$filteredRows[] = $row;
				}
			}
			if (is_array($userTasks[$row['id']])) {
				$addedUsers = array_merge($addedUsers, $userTasks[$row['id']]);
			}
		}
		if (!empty($filterUsers)) {
			$rows = $filteredRows;
		}
		$addedUsers = self::getUsers($addedUsers);

		if ($filter == 'spec') {
			$tasksTypes = array(
				'admin',
				'editor',
				'analyst',
				'tester',
				'designer',
				'fullstack',
				'backend',
				'frontend',
				'htmler',
				'sysadmin'
			);
		} elseif ($filter == 'exec') {
			$tasksTypes = array('none');
			foreach ($addedUsers as $u) {
				$tasksTypes[] = $u['userId'];
				$dict[$u['userId']] = $u['userName'];
			}
		} elseif ($filter == 'author') {
			$sql = 'SELECT id, name FROM users WHERE team_id = ? ORDER BY role ASC';
			$users = DB::select($sql, array($actor['team_id']));
			$tasksTypes = array();
			foreach ($users as $u) {
				$tasksTypes[] = $u['id'];
				$dict[$u['id']] = $u['name'];
			}
		} elseif ($filter == 'importance') {
			$tasksTypes = array(
				'burning',
				'urgent',
				'important',
				'usual',
				'insignificant',
				'future',
				'to_think'
			);
		} elseif ($filter == 'type') {
			$tasksTypes = array(
				'design',
				'prototype',
				'text',
				'html',
				'style',
				'frontend',
				'backend',
				'test',
				'page',
				'project'
			);
		} else {
			$tasks = array(
				'current' => array(),
				'locked' => array(),
				'in_work' => array(),
				'delayed' => array(),
				'ready' => array(),
				'frozen' => array(),
			);
		}

		if ($filter != 'status') {
			if ($actor['role_id'] < 5) {
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
			$tasks = array();
			foreach ($tasksTypes as $type) {
				$tasks[$type] = array();
				foreach ($statuses as $s) {
					$tasks[$type][$s] = array();
				}
			}
		}
		foreach ($rows as &$row) {
			$row['locked'] = $row['locked'] == 1;
			$row['actions'] = false;
			if ($actor['role_id'] < 5 || $row['changed_by'] == $actor['id'] || (empty($row['changed_by']) && in_array($actor['id'], $userTasks[$row['id']]))) {
				$row['actions'] = true;
			}
			if ($actor['role_id'] > 4 && 
				(($filter == 'all' && empty($row['task_user'])) || 
				!empty($row['changed_by']) && $row['changed_by'] != $actor['id'])
			) {
				$row['actions'] = false;
			}
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
			
			if ($filter == 'spec') {
				if (is_array($userTasksData[$row['id']])) {
					foreach ($userTasksData[$row['id']] as $u) {
						$spec = $u['spec'];
						$role = $u['role'];
						if (!empty($spec)) {
							$tasks[$spec][$row['status']][] = $row;
						} elseif (!empty($role)) {
							$tasks[$role][$row['status']][] = $row;
						}
					}
				}
			} else if ($filter == 'exec') {			

				if (empty($filterUsers) || ($row['status'] != 'current' && $row['status'] != 'frozen')) {
					$key = $row['changed_by'];
					if (empty($row['changed_by'])) {
						$key = !empty($row['for_user']) ? $row['for_user'] : 'none';
					}
					$tasks[$key][$row['status']][] = $row;
				} else if (is_array($userTasks[$row['id']])) {
					foreach ($userTasks[$row['id']] as $u) {
						if (is_array($tasks[$u]) && in_array($u, $filterUsers)) {
							$tasks[$u][$row['status']][] = $row;
						}
					}
				}

			} elseif ($filter == 'author') {
				$tasks[$row['author_id']][$row['status']][] = $row;
			} elseif ($filter == 'importance') {
				$tasks[$row['importance']][$row['status']][] = $row;
			} elseif ($filter == 'type') {
				$tasks[$row['type']][$row['status']][] = $row;
			} else {
				if (empty($row['status_id'])) {
					$row['locked'] = $row['locked'] == 1;					
					if (!empty($row['locked'])) {
						$tasks['locked'][] = $row;
					} else {
						$tasks['current'][] = $row;
					}
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

		if ($filter != 'status') {
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
		
		$properTasks = array();
		foreach ($tasks as $k => $v) {
			if (!empty($v)) {
				$properTasks[$k] = $v;
			}
		}
		success(array(
			'dict' => $dict,
			'tasks' => $properTasks,
			'order' => array_keys($tasks),
			'users' => $addedUsers
		));
	}


	static function getUsers($userIds) {
		if (empty($userIds)) {
			return array();
		}
		$sql = '
			SELECT 
				name AS userName, 
				id AS userId,
				avatar_id AS avatarId
			FROM 
				users
			WHERE 
				id IN ('.implode(',', $userIds).')
			ORDER BY 
				role ASC
		';
		return DB::select($sql);
	}
}