<?php

class Release {
	static function getList() {
		$actor = Actor::get();
		$sql = '
			SELECT 
				*
			FROM
				releases
			WHERE 
				team_id = ?
		';
		$releases = DB::select($sql, array($actor['team_id']));

		success(array(
			'releases' => $releases
		));
	}
}