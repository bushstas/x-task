<?php

switch ($language) {
	case 'eng':
		$dict = array(
			'reason' => 'The reason for absence',
			'click' => 'Click the button one more time',
			'statuses' => array(
				'1' => 'At work',
				'2' => 'Not at work',
				'3' => 'On vacation',
				'4' => 'On a sick leave',
				'5' => 'At dinner',
				'6' => 'Remotely'
			)
		);
	break;

	default:
		$dict = array(
			'reason' => 'Причина отсутствия',
			'click' => 'Нажмите на кнопку еще раз',
			'statuses' => array(
				'1' => 'На месте',
				'2' => 'Нет на месте',
				'3' => 'В отпуске',
				'4' => 'На больничном',
				'5' => 'На обеде',
				'6' => 'Удаленно'
			)
		);
}
