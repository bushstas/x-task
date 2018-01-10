<?php

switch ($language) {
	case 'eng':
		$scale = array(
			'In hours',
			'In minutes, hours and days',
			'In numbers from 1 to 5',
			'In numbers from 1 to 10',
			'In numbers from 1 to 100',
		);
		$dict = array(
			'title' => 'Title',
			'homepage' => 'Home page',
			'roots' => 'Root directories separated by commas',
			'nohashes' => 'Not to pay attention to anchors',
			'noparams' => 'Not to pay attention to GET params except',
			'settings' => 'Additional settings',
			'getparams' => 'Names separated by commas',
			'evals' => 'Scale of task difficulty evaluation'
		);
	break;

	default:
		$scale = array(
			'В часах',
			'В минутах, часах и днях',
			'В числах от 1 до 5',
			'В числах от 1 до 10',
			'В числах от 1 до 100'			
		);
		$dict = array(
			'title' => 'Название',
			'homepage' => 'Главная страница',
			'roots' => 'Корневые директории через запятую',
			'nohashes' => 'Не принимать во внимание якоря',
			'noparams' => 'Не принимать во внимание GET параметры кроме',
			'settings' => 'Дополнительные настройки',
			'getparams' => 'Названия через запятую',
			'evals' => 'Шкала оценки сложности задачи'
		);
}

$dict['roots_example'] = 'dev.project.com/directory';
$dict['evals_items'] = array(
	array(
		'value' => 0,
		'label' => $scale[0]
	),
	array(
		'value' => 1,
		'label' => $scale[1]
	),
	array(
		'value' => 2,
		'label' => $scale[2]
	),
	array(
		'value' => 3,
		'label' => $scale[3]
	),
	array(
		'value' => 4,
		'label' => $scale[4]
	)
);