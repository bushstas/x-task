<?php

class Rights {
	static function check($rightCode) {
		if (!self::isAvailable($rightCode)) {
			noRightsError();
		}
	}

	static function isAvailable($rightCode) {
		$actor = Actor::get();
		$sql = '
			SELECT 
				id
			FROM 
				rights
			WHERE 
				code = ?
			AND
				min_role >= ?
		';
		return DB::has($sql, array($rightCode, $actor['role_id']));		
	}

	static function getRights() {
		$actor = Actor::get();
		$sql = '
			SELECT 
				code
			FROM 
				rights
			WHERE 
				min_role >= ?
		';
		return DB::select($sql, array($actor['role_id']), 'code');
	}
}