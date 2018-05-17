<?php

switch ($language) {
	case 'eng':
		$dict = array(
			'current' => 'Added',
			'ready' => 'Completed',
			'in_work' => 'In work',
			'delayed' => 'Deferred',
			'frozen' => 'Frozen',
			'locked' => 'Created'
		);
	break;

	default:
		$dict = array(
			'current' => 'Добавлена',
			'ready' => 'Завершена',
			'in_work' => 'В работе',
			'delayed' => 'Отложена',
			'frozen' => 'Заморожена',
			'locked' => 'Создана'
		);
}
