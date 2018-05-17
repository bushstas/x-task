<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
}

mb_internal_encoding("UTF-8");

include 'db.php';
include 'utils.php';
requireClasses('actor', 'user', 'rights', 'dict');

$parts = explode('_', $_REQUEST['action']);
$token = $_REQUEST['token'];
$class = $parts[0];
array_shift($parts);
$action = $parts[0];
for ($i = 1; $i < count($parts); $i++) {
    $action .= ucfirst($parts[$i]);
}
$shouldBeAuthorized = true;
switch ($class) {
	case 'dict': 
		$shouldBeAuthorized = false;
	break;
} 

if (!empty($action)) {
	if (!$shouldBeAuthorized || !empty($token)) {
		if ($shouldBeAuthorized) {
			$actor = Actor::init($token);	
		} else {
			$actor = true;
		}				
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

unknownError();
