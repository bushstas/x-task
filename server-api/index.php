<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
}

mb_internal_encoding("UTF-8");

include 'db.php';
include 'utils.php';
requireClasses('actor', 'user', 'rights');

class XTask {

	static function create_project() {
		requireClasses('project');
		Project::create();
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

	static function load_task() {
		requireClasses('task');
		Task::getTaskForEditing();
	}

	static function load_invitations() {
		requireClasses('invitation');
		Invitation::get();
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

	static function task_action() {
		requireClasses('task');
		Task::doAction();
	}

	static function save_task() {
		requireClasses('task');
		Task::save();
	}

	static function load_task_users() {
		requireClasses('task');
		Task::getTaskUsers();
	}

	static function load_task_terms() {
		requireClasses('task');
		Task::getTerms();
	}

	static function get_task() {
		requireClasses('task');
		Task::getTaskId();
	}

	static function load_task_info() {		
		requireClasses('task');
		Task::getTaskInfo();
	}

	static function check_subtask() {
		requireClasses('task');
		Task::checkSubtask();
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

switch ($_GET['action']) {
	case 'dictionary':
		include 'dictionary/index.php';
	break;

	case 'tooltip':
		$name = $_REQUEST['name'];
		$tooltip = getHelp($name);

		if (!is_array($tooltip)) {
			error('Подсказка не найдена');
		}
		success(array('tooltip' => $tooltip));
	break;

	default:
		$parts = expolode('_', $_GET['action']);
		$token = $_GET['token'];
		$class = $parts[0];
		array_shift($parts);
		$action = $parts[0];
		for ($i = 1; $i < count($parts); $i++) {
		    $action .= ucfirst($parts[$i]);
		}
		if (!empty($action)) {
			if (!empty($token)) {
				$actor = Actor::init($token);
				if (!empty($actor)) {
					$className = ucfirst($class);
					if (!class_exists($className)) {
						requireClasses($class);
					}
					if (method_exists($className, $action)) {
						$className::$action();
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
		}		
}
unknownError();
