<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
}

mb_internal_encoding("UTF-8");

include 'db.php';
$db = DB::getDb();
include 'utils.php';
requireClasses('actor', 'user');

class XTask {

	static function load_user() {
		User::load();
	}

	static function create_user() {
		User::createUser();
	}

	static function create_project() {
		requireClasses('project');
		Project::create();
	}

	static function get_tooltip() {
		$name = $_REQUEST['name'];
		$tooltip = getHelp($name);

		if (!is_array($tooltip)) {
			error('Подсказка не найдена');
		}
		success(array('tooltip' => $tooltip));
	}

	static function load_url_dialog() {
		success(array(
			'dict' => getDict('url_dialog')
		));
	}

	static function load_info_dialog() {
		success(array(
			'dict' => getDict('info_dialog')
		));
	}

	static function logout() {
		User::logout();
	}

	static function load_users($refreshing = false) {
		User::getUsers($user, $refreshing);
	}

	static function refresh_users() {
		self::load_users(true);
	}

	static function save_user() {
		User::save();
	}

	static function load_board() {
		requireClasses('board');
		Board::getTasks();
	}

	static function load_tasks() {
		requireClasses('task');
		Task::getTasks();
	}

	static function load_task() {
		requireClasses('task');
		Task::getTaskForEditing();
	}

	static function set_project() {
		requireClasses('project');
		Project::set();
	}

	static function load_invitations() {
		requireClasses('invitation');
		Invitation::get();
	}

	static function load_avatars() {
		requireClasses('avatar');
		Avatar::getList();
	}

	static function assign_task() {
		requireClasses('task');
		Task::assignUserToTask();
	}

	static function get_project_data() {
		requireClasses('project');
		Project::getData();
	}

	static function get_user_data() {
		User::getData();
	}

	static function get_invitation_data() {
		requireClasses('invitation');
		Invitation::getData();
	}

	static function load_work_status() {
		User::loadWorkStatus();
	}

	static function save_work_status() {
		User::saveWorkStatus();
	}

	static function activate_project() {
		requireClasses('project');
		Project::activate();
	}
	
	static function request_project_access() {
		requireClasses('project');
		Project::requestAccess();
	}

	static function save_project() {
		requireClasses('project');
		Project::save();
	}

	static function create_invitation() {
		requireClasses('invitation');
		Invitation::create();
	}

	static function save_invitation() {
		requireClasses('invitation');
		Invitation::save();
	}

	static function load_task_actions() {
		requireClasses('task');
		Task::loadActions();
	}

	static function block_user() {
		User::block();
	}

	static function load_releases_list() {
		requireClasses('release');
		Release::getList();
	}

	static function load_user_tasks() {
		requireClasses('task');
		Task::loadUserTasks();
	}

	static function load_user_actions() {
		User::loadActions();
	}

	static function task_action() {
		requireClasses('task');
		Task::doAction();
	}

	static function load_projects_list() {
		requireClasses('project');
		Project::getList();
	}

	static function load_projects($user) {
		global $db;
		$r = $db->prepare('
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
		');
		$r->execute(array($user['team_id']));
		$projects = $r->fetchAll(PDO::FETCH_ASSOC);

		foreach ($projects as &$project) {
			if ($project['id'] == $user['project_id']) {
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

	static function save_task($user) {
		global $db;
		$data = json_decode($_REQUEST['data'], true);
		if (!is_array($data)) {
			unknownError();
		}
		extract($data);
		$isEditing = !empty($task_id);
		$noExecs = false;
		if ($isEditing) {
			$r = $db->prepare('
				SELECT 
					status_id
				FROM 
					tasks
				WHERE 
					id = ?
			');
			$r->execute(array($task_id));
			$row = $r->fetch(PDO::FETCH_ASSOC);
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
				$users = getExecutors($type, $action);
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
			$r = $db->prepare('SELECT id, role FROM users WHERE token IN ('.$tokens.')');
			$r->execute();
			$userRows = $r->fetchAll(PDO::FETCH_ASSOC);
			$minRole = 0;
			$forUser = 0;
			if (count($userRows) == 1) {
				$forUser = $userRows[0]['id'];
			}
			foreach ($userRows as $row) {
				if ($row['role'] > $minRole) {
					$minRole = $row['role'];
				}
			}	
			$lockedTask = $lockedTask ? 1 : 0;
		}

		if (!$isEditing) {
			requireClasses('project');
			$currentRelease = Project::getCurrentRelease($user);
			$idn = Project::getNextTaskNumber($currentRelease['id']);
			$taskToken = generateToken(6);
			$changed = strtotime('now');
			$untilTimestamp = getUntilTimestamp($until);
			$r = $db->prepare('
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
			');
			$r->execute(array(
				$idn,
				$user['team_id'],
				$user['id'],
				$user['project_id'],
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

			$r = $db->prepare('
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
			');
			$r->execute(array($taskToken, $user['id']));
			$row = $r->fetch(PDO::FETCH_ASSOC);
			if (!is_array($row)) {
				unknownError();	
			}
			$taskId = $row['id'];
		} else {
			$taskId = $task_id;
			if (!$noExecs) {
				$r = $db->prepare('
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
				');
				$r->execute(array(
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

				$r = $db->prepare('DELETE FROM tasks_users WHERE task_id = ?');
				$r->execute(array($taskId));
				$r = $db->prepare('DELETE FROM tasks_testers WHERE task_id = ?');
				$r->execute(array($taskId));
			} else {
				$r = $db->prepare('
					UPDATE
						tasks
					SET
						data = ?
					WHERE 
						id = ?
				');
				$r->execute(array(
					$data,
					$task_id
				));
			}
		}

		if (!$noExecs) {
			$r = $db->prepare('INSERT INTO tasks_users VALUES ("", ?, ?, ?, ?)');
			foreach ($userRows as $row) {
				$r->execute(array($taskId, $user['team_id'], $row['id'], $user['project_id']));
			}

			if (!empty($testers)) {
				$tokens = '"'.implode('","', $testers).'"';
				$r = $db->prepare('SELECT id, role FROM users WHERE token IN ('.$tokens.')');
				$r->execute();
				$userRows = $r->fetchAll(PDO::FETCH_ASSOC);
				$r = $db->prepare('INSERT INTO tasks_testers VALUES ("", ?, ?, ?, ?)');
				foreach ($userRows as $row) {
					$r->execute(array($taskId, $user['team_id'], $row['id'], $user['project_id']));
				}
			}
		}

		$successMessage = !$isEditing ? 'Задача успешно добавлена' : 'Задача успешно сохранена';
		success(
			null,
			$successMessage
		);
	}

	static function load_task_users($user) {
		$dict = getDict('task_users_dialog');
		$dict['users'] = getExecutors($_REQUEST['type'], $_REQUEST['taskAction']);
		success(array(
			'dict' => $dict
		));
	}

	static function load_task_counts() {
		requireClasses('task');
		success(array(
			'counts' => Task::getTasksCounts(),
			'progress' => Task::getTasksProgress()
		));
	}

	static function load_task_terms($user) {
		global $db;
		$r = $db->prepare('SELECT * FROM task_terms ORDER BY id ASC');
		$r->execute();
		$dict = getDict('task_terms');
		$terms = $r->fetchAll(PDO::FETCH_ASSOC);
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

	static function get_task($user) {
		global $db;
		$idn = $_REQUEST['idn'];
		$r = $db->prepare('SELECT id FROM tasks WHERE team_id = ? AND idn = ?');
		$r->execute(array($user['team_id'], $idn));
		$task = $r->fetch(PDO::FETCH_ASSOC);
		success(array(
			'id' => $task['id']
		));
	}

	static function load_task_info($user) {
		global $db;
		requireClasses('task');

		$id = $_REQUEST['id'];
		$r = $db->prepare('
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
		');

		$r->execute(array($id));
		$task = $r->fetch(PDO::FETCH_ASSOC);
		$task['locked'] = $task['locked'] == 1;

		$data = json_decode($task['data'], true);
		foreach ($data as $k => $v) {
			if (empty($task[$k])) {
				$task[$k] = $v;
			}
		}
		unset($task['data']);

		$r = $db->prepare('
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
		');
		$r->execute(array($id));
		$taskUsers = $r->fetchAll(PDO::FETCH_ASSOC);

		$r = $db->prepare('
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
		');
		$r->execute(array($id));
		$taskTesters = $r->fetchAll(PDO::FETCH_ASSOC);

		$users = array(
			'author' => array('id' => $task['user_id'], 'avatar_id' => $task['avatar_id'], 'name' => $task['user_name']),
			'executors' => array(),
			'testers' => array()
		);
		$actions = $task['user_id'] == $user['id'];
		foreach ($taskUsers as $usr) {
			if ($usr['user_id'] == $user['id']) {
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

		$r = $db->prepare('
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
		');
		$r->execute(array($id));
		$taskActions = $r->fetchAll(PDO::FETCH_ASSOC);

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
		$r = $db->prepare('
			SELECT 
				*
			FROM 
				subtasks
			WHERE 
				task_id = ?
		');
		$r->execute(array($id));
		$subtasks = $r->fetchAll(PDO::FETCH_ASSOC);
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
			$r = $db->prepare('
				SELECT 
					period
				FROM 
					tasks_periods
				WHERE 
					task_id = ?
			');
			$r->execute(array($id));
			$taskPeriod = $r->fetch(PDO::FETCH_ASSOC);

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
			'own' => $task['changed_by'] == $user['id'] || $task['user_id'] == $user['id']
		));
	}

	static function check_subtask($user) {
		$id = $_REQUEST['id'];
		$idx = $_REQUEST['idx'];
		$checked = $_REQUEST['checked'];
		requireClasses('task');
		
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
		
		$row = DB::get($sql, array($id, $user['id'], $user['id']));
		if (!is_array($row)) {
			noRightsError();
		}
		Task::checkSubtask($id, $idx, $checked);
		success();
	}

	static function load_until_date() {
		$timestamp = getUntilTimestamp($_REQUEST['value']);
		$diff = $timestamp - time();
		$left = 'left';
	    if ($diff < 0) {
	    	$diff = -$diff;
	    	$left = 'overdue';
	    }
		$value = getFormattedDate($diff, $left);
		success(
			array(
				'value' => $value
			)
		);
		unknownError();
	}
}

$action = $_GET['action'];
$token = $_GET['token'];

if ($action == 'dictionary') {
	include 'dictionary/index.php';
}

if (!empty($token)) {	
	$actor = Actor::init($token);
	if (is_array($actor)) {
		if (method_exists(XTask, $action)) {
			XTask::$action();
		} else {
			error('Неизвестное действие');
		}
	} else {
		error('По текущему токену сессии пользователь не найден, авторизуйтесь заново', 'invalid_token');
	}
} elseif (isset($_REQUEST['login'])) {
	if ($action == 'auth') {
		User::auth();
	} elseif ($action == 'register') {
		User::register();
	}
}
unknownError();