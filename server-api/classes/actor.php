<?php

class Actor {
	private static $actor;

	static function init($token) {
		$sql = '
			SELECT 
				u.id,
				u.name,
				u.team_id,
				u.project_id,
				r.id AS role_id,
				r.code AS role,
				sp.code AS spec,
				rl.id AS release_id
			FROM 
				sessions s
			JOIN 
				users u 
				ON u.id = s.user_id
			JOIN 
				roles r 
				ON u.role = r.id 
			LEFT JOIN 
				specs sp 
				ON u.spec = sp.id 
			LEFT JOIN 
				releases rl 
				ON u.project_id = rl.project_id AND rl.active = 1 
			WHERE 
				s.token = ?
		';
		self::$actor = DB::get($sql, array($token));
		return self::$actor;
	}

	static function get() {
		return self::$actor;
	}
}