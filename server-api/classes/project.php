<?php

class Project {
	static function get($token) {
		$sql = '
			SELECT 
				p.*
			FROM 
				projects p 
			WHERE 
				p.token = ?
		';
		return DB::get($sql, array($token));
	}
}