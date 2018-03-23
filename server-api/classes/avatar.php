<?php

class Avatar {
	static $COUNT = 65;


	static function getList($user) {
		$avatars = array();

		$sql = 'SELECT avatar_id FROM users WHERE team_id = ?';
		$rows = DB::select($sql, array($user['team_id']));
		
		$avatarIds = array();
		foreach ($rows as $row) {
			$avatarIds[] = (int)$row['avatar_id'];
		}

		for ($i = 1; $i <= self::$COUNT; $i++) {
			$avatars[] = array('id' => $i, 'available' => !in_array($i, $avatarIds));
		}

		success(array(
			'avatars' => $avatars
		));
	}
}