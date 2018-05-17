<?php


switch ($language) {
	case 'eng':
		$dict = array(
			'title' => 'Select executors of the task',
			'proper' => 'Appropriate executors',
			'testers' => 'Testers',
			'rest' => 'Rest users',
			'none' => 'No users'
		);

	break;

	default:
		$dict = array(
			'title' => 'Выбор испольнителей задачи',
			'proper' => 'Подходящие исполнители',
			'testers' => 'Тестировщики',
			'rest' => 'Остальные пользователи',
			'none' => 'Нет пользователей'
		);
}
