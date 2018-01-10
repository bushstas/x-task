<?php

switch ($language) {
	case 'eng':
		$dict = array(
			'current' => 'Added',
			'ready' => 'Completed',
			'in_work' => 'In work',
			'delayed' => 'Deferred'
		);
	break;

	default:
		$dict = array(
			'current' => 'Добавлена',
			'ready' => 'Завершена',
			'in_work' => 'В работе',
			'delayed' => 'Отложена'
		);
}
