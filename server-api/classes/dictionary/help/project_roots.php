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
	'https://site.com',
	array(
		'http://site.com',
		'http://super.site.com',
		'http://mega.super.site.com'
	),
	array(
		'https://site.com',
		'https://*.site.com'
	),
	array(
		'http://dev.project.com/beta,',
		'http://dev.project.com/alpha',
		'http://project.com/developer-john',
		'http://project.com/developer-jack',
		'http://project.com/repositories/john',
		'http://project.com/repositories/jack'
	),
	array(
		'http://dev.project.com/*',
		'http://project.com/repositories/*',
		'http://project.com/*/code',
		'http://project.com/*/*'
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


