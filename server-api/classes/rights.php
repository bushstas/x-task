<?php

class Rights {
	static function check($rightCode) {
		$actor = Actor::get();
		$sql = '
			SELECT 
				id
			FROM 
				rights
			WHERE 
				code = ?
			AND
				min_role <= ?
		';
		if (!DB::has($sql, array($rightCode, $actor['role_id']))) {
			noRightsError();
		}
	}
}