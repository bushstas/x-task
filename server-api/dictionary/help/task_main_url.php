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
				'Основная страница задачи'
			),
			'lines' => array(
				'Страница, на которой вы создаете задачу.',
				'Из адреса основной страницы автоматически генерируются дополнительные адреса.',
				'Используйте дополнительные опции, чтобы вырезать из адреса GET параметры или якоря.'
			)
		);
}

Help::init($dict);

$help = array(
	Help::getCaption(),
	Help::getLine(),
	Help::getLine(),
	Help::getLine(),
	Help::getSpace()
);


