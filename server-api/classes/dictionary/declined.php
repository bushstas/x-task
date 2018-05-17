<?php

switch ($language) {
	case 'eng':
		$dict = array(
			'm' => array('minute', 'minutes', 'minutes'),
			'h' => array('hour', 'hours', 'hours'),
			'd' => array('day', 'days', 'days'),
			'w' => array('week', 'weeks', 'weeks')
		);
	break;

	default:
		$dict = array(
			'm' => array('минута', 'минуты', 'минут'),
			'h' => array('час', 'часа', 'часов'),
			'd' => array('день', 'дня', 'дней'),
			'w' => array('неделя', 'недели', 'недель')
		);
}
