<?php

if (!class_exists('Help')) {
	include __DIR__.'/../help_funcs.php';
}

switch ($language) {
	case 'eng':
		$dict = array(
			'cap1' => 'Home page',
			'l1' => '',
			'l2' => ''
		);
	break;

	default:
		$dict = array(
			'captions' => array(
				'Дополнительные страницы задачи'
			),
			'lines' => array(
				'Автоматически генерируются из основного адреса при условии, что заданы корневые директории в настройках проекта. 
				Если вы еще не настроили данные директории, зайдите во вкладку проектов и отредактируейте нужный проект.',
				'Также вы можете вписать руками любое количество дополнительных адресов, где будет доступна данная задача.'
			)
		);
}

Help::init($dict);

$help = array(
	Help::getCaption(),
	Help::getLine(),
	Help::getLine(),
	Help::getSpace()
);


