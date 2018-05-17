<?php

switch ($language) {
	case 'eng':
		$dict = array(
			'title' => 'Title',
			'homepage' => 'Home page',
			'roots' => 'Root directories separated by commas',
			'nohashes' => 'Not to pay attention to anchors',
			'noparams' => 'Not to pay attention to GET params except',
			'settings' => 'Additional settings',
			'getparams' => 'Names separated by commas'
		);
	break;

	default:
		$dict = array(
			'title' => 'Название',
			'homepage' => 'Главная страница',
			'roots' => 'Корневые директории через запятую',
			'nohashes' => 'Не принимать во внимание якоря',
			'noparams' => 'Не принимать во внимание GET параметры кроме',
			'settings' => 'Дополнительные настройки',
			'getparams' => 'Названия через запятую'
		);
}

$dict['roots_example'] = 'dev.project.com/directory';