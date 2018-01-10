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
				'Главная страница'
			),
			'lines' => array(
				'Ссылка, на которую вы будете автоматически перенаправлены при переходе на проект.',
				'Если не указана, переключение проекта будет осуществляться без перехода на другой URL.'
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


