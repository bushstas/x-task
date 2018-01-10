<?php




switch ($language) {
	case 'eng':
		$dict = array(
			'title' => 'Extended task info',
			'preview' => 'Preview task'
		);

		$d = array(
			'terms' => 'Terms of execution',
			'sources' => 'Where to find sources',
			'design' => 'Where to find design',
			'prototypes' => 'Where to see prototypes',
			'use' => 'What to use',
			'implement' => 'How to implement',
			'data' => 'What data structure',
			'before' => 'What to do before',
			'after' => 'What to do after',
			'examples' => 'Where to see examples',
			'diff' => 'What to do in case of difficulties',
			'award' => 'Amount of remuneration'
		);
	break;

	default:
		$dict = array(
			'title' => 'Раширенное описание задачи',
			'preview' => 'Предпросмотр задачи'
		);
		$d = array(
			'terms' => 'Сроки исполнения',
			'sources' => 'Где взять исходники',
			'design' => 'Где взять дизайн',
			'prototypes' => 'Где смотреть макеты',
			'use' => 'Что использовать',
			'implement' => 'Как реализовывать',
			'data' => 'Какая структура данных',
			'before' => 'Что сделать до выполнения',
			'after' => 'Что сделать после выполнения',
			'examples' => 'Где смотреть примеры',
			'diff' => 'Что делать при трудностях',
			'award' => 'Размер вознаграждения'
			
		);
}

$icons = array(
	'terms' => 'update',
	'sources' => 'folder_open',
	'design' => 'folder_open',
	'prototypes' => 'folder_open',
	'use' => 'folder_open',
	'implement' => 'folder_open',
	'data' => 'folder_open',
	'before' => 'folder_open',
	'after' => 'folder_open',
	'examples' => 'folder_open',
	'diff' => 'folder_open',
	'award' => 'folder_open'
);


$items = array(
	'terms'
);

switch ($_POST['type']) {
	case 'design':
		array_push($items, 'prototypes', 'examples');
	break;

	case 'prototype':
		array_push($items, 'prototypes', 'examples');
	break;

	case 'text':
		array_push($items, 'sources', 'examples');
	break;

	case 'html':
		array_push($items, 'design', 'examples');
	break;

	case 'style':
		array_push($items, 'design', 'examples');
	break;

	case 'frontend':
		array_push($items, 'design', 'use', 'implement', 'data', 'examples');
	break;

	case 'backend':
		array_push($items, 'use', 'implement', 'data', 'examples');
	break;

	case 'test':
		array_push($items, 'use');
	break;

	case 'page':
		array_push($items, 'prototypes', 'design', 'use', 'examples');
	break;

	case 'project':
		array_push($items, 'examples');
	break;
}

array_push($items, 'before', 'after', 'diff', 'award');
$dict['captions'] = array();

foreach ($items as $v) {
	$dict['icons'][$v] = $icons[$v];
	$dict['captions'][$v] = $d[$v];
}

