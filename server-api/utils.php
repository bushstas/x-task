<?php

function mb_lcfirst($text) {
    return mb_strtolower(mb_substr($text, 0, 1)) . mb_substr($text, 1);
}

function requireClasses() {
	$names = func_get_args();
	foreach ($names as $name) {
		$path = __DIR__.'/classes/'.$name.'.php';
		if (file_exists($path)) {
			require_once $path;
		}
	}
}

function validateUserIdAndRightsToEditUser($action = null) {
	$actor = Actor::get();
	$userId = $_REQUEST['id'];
	if (empty($userId)) {
		error('Ошибка при действии над пользователем');
	}
	switch ($action) {
		case 'block':
			if ($actor['id'] == $userId || ($actor['role'] != 'head' && $actor['role'] != 'admin')) {
				noRightsError();
			}
		break;

		default:
			if ($actor['id'] != $userId && $actor['role'] != 'head' && $actor['role'] != 'admin') {
				noRightsError();
			}
	}	
	return $userId;
}

function validateProjectToken() {
	$projectToken = $_REQUEST['projectToken'];
	if (empty($projectToken)) {
		error('Ошибка при действии над проектом');
	}
	return $projectToken;
}

function validateTokenAndRightsToEditProject($action = null) {
	$actor = Actor::get();
	$projectToken = validateProjectToken();
	switch ($action) {
		default:
			if ($actor['role_id'] > 3) {
				noRightsError();
			}
	}	
	return $projectToken;
}

function validateInvitationTokenAndRights($role, $token) {
	$actor = Actor::get();
	if (empty($token)) {
		error('Ошибка при действии над приглашением');
	}
	if ($actor['role'] != 'head' && $actor['role'] != 'admin') {
		noRightsError();
	}
	if ($actor['role'] == 'admin' && $role == 2) {
		noRightsError();	
	}
	return $token;
}

function validateLogin($login) {
	if (empty($login)) {
		error('Введите логин');
	}
	if (strlen($login) < 5) {
		error('Логин должен содержать не менее 5-ти символов');
	}
	if (!preg_match('/^[\w]+$/', $login)) {
		$symbols = preg_replace('/[\w]/', '', $login);
		error('Логин содержит некорректные символы: '.$symbols);
	}
	return $login;
}

function validatePassword($password, $password2, $saving = false) {
	if (!$saving && empty($password)) {
		error('Введите пароль');
	}
	if (strlen($password) > 1 && strlen($password) < 5) {
		error('Пароль должен содержать не менее 5-ти символов');
	}	
	if (preg_match('/[а-я]/usi', $password)) {
		$symbols = preg_replace('/[^а-я]/usi', '', $password);
		error('Пароль содержит кириллические символы: '.$symbols);
	}
	if (empty($password2)) {
		if (!$saving || !empty($password)) {
			error('Повторите пароль');
		}
	} elseif ($saving && empty($password)) {
		error('Введите пароль');
	}
	if ($password != $password2) {
		error('Пароли не совпадают');
	}
	return $password;
}

function validateUserName($userName) {
	if (empty($userName)) {
		error('Введите имя пользователя');
	}
	if (!preg_match('/^[a-zа-я ]+$/usi', $userName)) {
		$symbols = preg_replace('/[a-zа-я ]/usi', '', $userName);
		error('Имя содержит некорректные символы: '.$symbols);
	}
	return $userName;
}

function validateEmail($email) {
	if (empty($email)) {
		error('Введите email');
	}
	if (!preg_match('/^[\w]+@[\w]+\.[a-z]{2,10}$/', $email)) {
		error('Введите корректный email');
	}
	return $email;
}

function validateInvitationCode($code) {
	if (strlen($code) > 0 && strlen($code) != 20) {
		error('Некорректный код приглашения');
	}
	return $code;
}

function validateRole($role) {
	if (empty($role)) {
		error('Укажите роль пользователя');
	}
	return $role;
}

function validateSpec($spec, $role) {
	if ($role == 6) {
		if (empty($spec)) {
			error('Укажите специализацию разработчика');
		}
		return $spec;
	} 
	return null;
}

function validateProjects($projects, $role) {
	$projects = json_decode($projects, true);
	if ($role > 2 && empty($projects)) {
		error('Укажите хотя бы один проект');
	}
	return $projects;
}

function validateUniqueness($l, $p, $e, $r) {
	if (is_array($r)) {		
		if ($r['login'] == $l) {
			error('Пользователь с таким логином уже существует');
		}
		if ($r['password'] == $p) {
			error('Пользователь с таким паролем уже существует');
		}
		if ($r['email'] == $e) {
			error('Пользователь с таким email уже существует');
		}
	}
}

function validateTitle($title) {
	if (empty($title)) {
		error('Введите название');
	}
	if (!preg_match('/^[a-zа-я ]+$/usi', $title)) {
		$symbols = preg_replace('/[a-zа-я ]/usi', '', $title);
		error('Название содержит некорректные символы: '.$symbols);
	}
	return $title;
}

function validateHomepage($homepage) {
	if (!empty($homepage) && !preg_match('/https*:\/\/[\w\-\.]{2,}/', $homepage)) {
		error('Введите корректный URL главной страницы');
	}
	return $homepage;
}

function validateProjectAccess($projectToken) {
	$actor = Actor::get();
	$sql = '
		SELECT 
			*
		FROM 
			projects
		WHERE 
			token = ? 
		AND
			team_id = ?
	';
	$project = DB::get($sql, array($projectToken, $actor['team_id']));
	if (empty($project)) {
		noRightsError();
	}
	return $project;
}

function error($error, $errcode = '') {
	if (!empty($errcode)) {
		die('{"success":false,"error":"'.$error.'","errcode":"'.$errcode.'"}');
	}
	die('{"success":false,"error":"'.$error.'"}');
}

function unknownError() {
	error('Неизвестная ошибка при обработке запроса');
}

function noRightsError() {
	error('У вас нет прав на данное действие');	
}

function success($params = null, $message = null) {
	$data = array(
		'success' => true,
		'body' => array()
	);
	if (is_string($message) && !empty($message)) {
		$data['message'] = $message;
	}
	if (is_array($params)) {		
		foreach ($params as $k => $v) {
			$data['body'][$k] = $v;
		}
	}
	die(json_encode($data));
}

function getFormattedDate($date, $ago = null) {
	requireClasses('dict');
	$language = Dict::getLang();
	$dict = Dict::getByName('time'); 
 	
 	if ($ago == 'waited' && $language == 'ru') {
 		$dict['second'] = $dict['_second'];
 		$dict['minute'] = $dict['_minute'];
 	}
    $seconds = array( $dict['second'], $dict['seconds'], $dict['seconds2'] );
    $minutes = array( $dict['minute'], $dict['minutes'], $dict['minutes2'] );
    $hours   = array( $dict['hour'], $dict['hours'], $dict['hours2'] );
    $days    = array( $dict['day'], $dict['days'], $dict['days2'] );
    $months  = array( $dict['month'], $dict['months'], $dict['months2'] );
    $years   = array( $dict['year'], $dict['years'], $dict['years2'] );
    $decades = array( $dict['decade'], $dict['decades'], $dict['decades2'] );
 
    $phrase = array($decades, $years, $months,  $days, $hours,  $minutes, $seconds);
    $length = array(315705600, 31570560, 2630880, 86400, 3600, 60, 1);
 
    $str = array();
    if ($date == 0) {
    	return $dict['just_now'];
    }
    $firstVal = 0;
    $firstType = 999;
    foreach ($length as $i => $l) {
    	if ($date >= $l) {
    		if (!empty($firstVal) && $l == 1) {
    			break;
    		}
    		if ($firstType < 3 && $i > 3) {
				break;
    		}
    		if ($firstType == 3 && $i > 4) {
				break;
    		}
	    	$v = floor($date / $l);
	    	if (empty($firstVal)) {
	    		$firstVal = $v;
	    		$firstType = $i;
	    	}

	    	$str[] = $v.' '.getPhrase($v, $phrase[$i]);
	    	$date = $date - ($v * $l);	    	
    	}
    }
    $str = implode(' ', $str);
    if ($ago === 'overdue') {
    	return  $dict['overdue'].' '.$str;
    } elseif ($ago == 'left') {
    	if ($language == 'ru') {
    		return  getPhrase($firstVal, $dict['left']).' '.$str;
    	}
    	return  $str.' '.getPhrase($firstVal, $dict['left']);
    } elseif ($ago == 'waited') {
		return  $dict['waited'].' '.$str;
    } elseif ($ago == 'in_work') {
		return  $dict['in_work'].' '.$str;
    } elseif ($ago == 'passed') {
    	$key = 'passed';
    	if ($firstType > 4) {
    		$key = 'passed2';
    	}
    	if ($language == 'ru') {
    		return  getPhrase($firstVal, $dict[$key]).' '.$str;
    	}
    	return  $str.' '.getPhrase($firstVal, $dict[$key]);
    } elseif ($ago == 'ago') {
		return $str.' '.$dict['ago'];
    }
    return $str;
}
 
function getPhrase($number, $titles) {
    $cases = array( 2, 0, 1, 1, 1, 2 );
 
    return $titles[ ( $number % 100 > 4 && $number % 100 < 20 ) ? 2 : $cases[ min( $number % 10, 5 ) ] ];
}

function generateUniqueToken($tableName) {
	$token = '';
	while (empty($token)) {
		$token = generateToken();
		$sql = '
			SELECT 
				id
			FROM 
				'.$tableName.'
			WHERE 
				token = ?
		';
		$row = DB::get($sql, array($token));
		if (is_array($row)) {
			$token = '';
		} else {
			return $token;
		}
	}
}

function generateToken($length = 20) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function decline($number, $keyword) {
	$dict = Dict::getByName('declined');
  	$cases = array (2, 0, 1, 1, 1, 2);
  	return $dict[$keyword][ ($number % 100 > 4 && $number % 100 < 20) ? 2 : $cases[min($number % 10, 5)] ];
}

function getAccessableTaskActions($id) {
	$actor = Actor::get();
	$sql = '
		SELECT 
			t.*,
			u.role AS role_id
		FROM 
			tasks t
		JOIN users u
			ON t.user_id = u.id 
		WHERE 
			t.id = ?
		AND 
			t.team_id = ?
	';
	$task = DB::get($sql, array($id, $actor['team_id']));
	if (empty($task)) {
		noRightsError();
	}
	$changedBy = $task['changed_by'];
	$status = $task['status_id'];
	$minRole = $task['min_role'];	

	$sql = '
		SELECT 
			tu.id
		FROM 
			tasks_users tu
		WHERE 
			tu.task_id = ?
		AND 
			tu.user_id = ?
	';
	$taskUser = DB::get($sql, array($id, $actor['id']));
	
	$isUserTask = is_array($taskUser) && ($changedBy == $actor['id'] || empty($status) || $status == 4);
	$actions = array();
	if ($isUserTask) {
		// in_work
		if (!empty($task['locked'])) {
			$actions[] = 'estimate';
		} else {
			if ($status == 2) {
				$actions[] = 'complete';
				$actions[] = 'delay';
				$actions[] = 'refuse';
				$actions[] = 'problem';
			}
			// none
			elseif (empty($status)) {
				$actions[] = 'take';
				$actions[] = 'problem';
			}
			// ready
			elseif ($status == 1) {
				$actions[] = 'resume';
			}
			// delayed
			elseif ($status == 3) {
				$actions[] = 'continue';
				$actions[] = 'refuse';
				$actions[] = 'problem';
			}
			if (empty($status) || $status == 4) {
				$actions[] = 'estimate';
			}
			$actions[] = 'comment';
		}
	} elseif ($actor['role_id'] < $minRole) {
		$hasPower = $actor['role_id'] <= $task['role_id'];
		$actions[] = 'admin';
		if ($hasPower && $status != 2 && $task['locked'] == 0) {
			$actions[] = 'start';
		}
		if ($hasPower && $task['locked'] == 1) {
			$actions[] = 'unblock';	
		}
		if ($task['locked'] == 0 && ($status > 2 || empty($status))) {
			$actions[] = 'assign';
		}
		if ($status != 1 && $status != 5 && $hasPower) {
			$actions[] = 'edit';
		}		 
		// ready
		if ($status == 1 || $status == 3) {
			$actions[] = 'close';
		} elseif ($status == 4) {
			$actions[] = 'unfreeze';
		} elseif ($status == 5) {
			$actions[] = 'open';
		}
		if ($hasPower && $status != 2) {
			$actions[] = 'remove';
		}
		if ($task['locked'] == 0 && $hasPower && (empty($status) || $status == 3)) {
			$actions[] = 'freeze';	
		}
		$actions[] = 'comment';
	}
	return $actions;
}

function getUntilTimestamp($value) {
	if ($value[0] === 'n') {
		$day = (int)str_replace('n', '', $value);
		$currentDate = (int)date('d');
		$month = (int)date('m');
		$year = (int)date('Y');
		if ($currentDate >= $day) {
			$month++;
			if ($month == 13) {
				$month = 1;
				$year++;
			}
		}
		$timestamp = strtotime(($day < 10 ? '0'.$day : $day).'.'.($month < 10 ? '0'.$month : $month).'.'.$year);			
	} else {
		switch ((int)$value) {
			case 0:
				$timestamp = strtotime(date('d.m.Y 13:00:00'));
			break;

			case 1:
				$timestamp = strtotime(date('d.m.Y 18:59:59'));
			break;

			case 2:
				$timestamp = strtotime(date('d.m.Y 23:59:59'));
			break;

			case 3:
				$timestamp = strtotime('tomorrow 13:00:00');
			break;

			case 4:
				$timestamp = strtotime('tomorrow 18:59:59');
			break;

			case 6:
				$timestamp = strtotime('next monday');
			break;

			case 7:
				$timestamp = strtotime('next tuesday');
			break;

			case 8:
				$timestamp = strtotime('next wednesday');
			break;

			case 9:
				$timestamp = strtotime('next thursday');
			break;

			case 10:
				$timestamp = strtotime('next friday');
			break;

			case 11:
				$timestamp = strtotime('next saturday');
			break;

			case 12:
				$timestamp = strtotime('next sunday');
			break;

			case 14:
				$timestamp = strtotime('next monday');
			break;

			case 15:
				$month = (int)date('m') + 1;
				$year = (int)date('Y');
				if ($month == 13) {
					$month = 1;
					$year++;
				}
				$date = '01.'.($month < 10 ? '0'.$month : $month).'.'.$year;
				$timestamp = strtotime($date);
			break;

			case 16:
				$year = (int)date('Y') + 1;
				$date = '01.01.'.$year;
				$timestamp = strtotime($date);
			break;
		}
	}
	return $timestamp;
}