<?php

class DB {
	private static $db;

	static function init() {
		$host = "tanyushka.mysql";
		$dbname = "tanyushka_xtask";
		$user = "tanyushka_mysql";
		$pass = "RL/mch1b";

		self::$db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
		self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
	}

	static function getDb() {
		return self::$db;
	}

	static function get($sql, $params = null, $field = null) {
		$r = self::$db->prepare($sql);
		if (is_array($params) && !empty($params)) {
			$r->execute($params);
		} else {
			$r->execute();
		}
		$row = $r->fetch(PDO::FETCH_ASSOC);
		if (is_string($field) && is_array($row)) {
			return $row[$field];
		}
	 	return $row;
	}

	static function select($sql, $params = null, $field = null) {
		$r = self::$db->prepare($sql);
		if (is_array($params) && !empty($params)) {
			$r->execute($params);
		} else {
			$r->execute();
		}
		$rows = $r->fetchAll(PDO::FETCH_ASSOC); 
	 	if (!empty($field) && is_string($field) && isset($rows[0])  && isset($rows[0][$field])) {
	 		$list = array();
	 		foreach ($rows as $row) {
	 			$list[] = $row[$field];
	 		}
	 		return $list;
	 	}
	 	return $rows;
	}

	static function execute($sql, $params = null) {
		$r = self::$db->prepare($sql);
		if (is_array($params) && !empty($params)) {
			$r->execute($params);
		} else {
			$r->execute();
		}
	}

	static function has($sql, $params = null) {
		$rows = self::select($sql, $params);
		return !empty($rows);
	}
}
DB::init();