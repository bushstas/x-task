<?php

switch ($language) {
	case 'eng':
		$dict = array(
			'title' => 'Task pages',
			'caption1' => 'Primary',
			'caption2' => 'Additional',
			'nohashes' => 'Not to pay attention to anchors',
			'noparams' => 'Not to pay attention to GET params except'
		);
	break;

	default:
		$dict = array(
			'title' => 'Страницы задачи',
			'caption1' => 'Основная',
			'caption2' => 'Дополнительные',
			'nohashes' => 'Не принимать во внимание якоря',
			'noparams' => 'Не принимать во внимание GET параметры кроме'
		);
}