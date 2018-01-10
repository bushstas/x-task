<?php

if (!class_exists('Help')) {
	include __DIR__.'/../help_funcs.php';
}

switch ($language) {
	case 'eng':
		$dict = array(
			'captions' => array(
				'Корневые директории'
			)
		);
	break;

	default:
		$dict = array(
			'captions' => array(
				'Корневые директории'
			),
			'lines' => array(
				'Список всех корневых папок, где может располагаться данный проект, через запятую или перенос строки.',
				'Если у вас обычный сайт, корневая директория может выглядеть так:',
				'Если проект должен быть доступен на поддоменах:',
				'Если проект должен быть доступен на всех поддоменах:',
				'Если у вас сложное веб-приложение с различными репозиториями и разработчиками:',
				'Используйте символ "*" для любой директории:',
				'Если вы разрабатываете на локальной машине:',

			)
		);
}

$dict['codes'] = array( 
	'site.com',
	array(
		'site.com',
		'super.site.com',
		'mega.super.site.com'
	),
	array(
		'site.com',
		'*.site.com'
	),
	array(
		'dev.project.com/beta,',
		'dev.project.com/alpha',
		'project.com/developer-john',
		'project.com/developer-jack',
		'project.com/repositories/john',
		'project.com/repositories/jack'
	),
	array(
		'dev.project.com/*',
		'project.com/repositories/*',
		'project.com/*/code',
		'project.com/*/*'
	),
	array(
		'localhost:8080',
		'localhost:*'
	),
);			

Help::init($dict);
	
$help = array(
	Help::getCaption(),
	Help::getLine(),
	Help::getSpace(),
	Help::getLine(),
	Help::getCode(),
	Help::getLine(),
	Help::getCode(),
	Help::getLine(),
	Help::getCode(),
	Help::getLine(),
	Help::getCode(),
	Help::getLine(),
	Help::getCode(),
	Help::getLine(),
	Help::getCode(),

	Help::getSpace()
);


