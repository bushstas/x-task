<?php

switch ($language) {
	case 'eng':
		$dict = array(
			'design' => 'Design',
			'html' => 'HTML',
			'text' => 'Texts',
			'prototype' => 'Prototypes',
			'backend' => 'Backend',
			'frontend' => 'Frontend',
			'test' => 'Tests',
			'page' => 'Pages',
			'style' => 'Styles',
			'project' => 'Project',

			'frozen' => 'Back burner',
			'closed' => 'Archive',
			'ready' => 'Ready',
			'in_work' => 'In work',
			'current' => 'To do',
			'cant_do' => 'Problematic',
			'delayed' => 'Deferred',
		);
	break;

	default:
		$dict = array(
			'design' => 'Дизайн',
			'html' => 'Верстка',
			'text' => 'Тексты',
			'prototype' => 'Макеты',
			'backend' => 'Бэкэнд',
			'frontend' => 'Фронтэнд',
			'test' => 'Тесты',
			'page' => 'Страницы',
			'style' => 'Стили',
			'project' => 'Проект',

			'frozen' => 'Долгий ящик',
			'closed' => 'Архив',
			'ready' => 'Готовые',
			'in_work' => 'В работе',
			'current' => 'Текущие',
			'cant_do' => 'Проблемные',
			'delayed' => 'Отложенные',
		);
}
