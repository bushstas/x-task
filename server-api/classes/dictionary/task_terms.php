<?php

switch ($language) {
	case 'eng':
		$dict = array(
			'title' => 'Task terms and difficulty',
			'diff' => 'Estimated difficulty',
			'period' => 'Estimated terms',
			'till' => 'Should be completed until',
			'untils' => array(
				'afternoon',
				'the end of the day',
				'tomorrow',
				'tomorrow afternoon',
				'the end of tomorrow',
				'monday',
				'tueday',
				'wednesday',
				'thursday',
				'friday',
				'saturday',
				'sunday',
				'the end of the week',
				'the end of the month',
				'the end of the year'
			),
			'number' => 'th day'
		); 
	break; 

	default:
		$dict = array(
			'title' => 'Сложность  и сроки задачи',
			'diff' => 'Предполагаемая сложность',
			'period' => 'Предполагаемые сроки',
			'till' => 'Должна быть выполнена до',
			'untils' => array(
				'обеда',
				'конца дня',
				'завтра',
				'завтрашнего обеда',
				'конца завтрашнего дня',
				'',
				'понедельника',
				'вторника',
				'среды',
				'четверга',
				'пятницы',
				'субботы',
				'воскресенья',
				'',
				'конца недели',
				'конца месяца',
				'конца года'
			),
			'number' => '-го числа'
		);
}


