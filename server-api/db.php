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

	static function select($sql, $params = null) {
		$r = self::$db->prepare($sql);
		if (is_array($params) && !empty($params)) {
			$r->execute($params);
		} else {
			$r->execute();
		}
	 	return $r->fetchAll(PDO::FETCH_ASSOC);
	}

	static function execute($sql, $params = null) {
		$r = self::$db->prepare($sql);
		if (is_array($params) && !empty($params)) {
			$r->execute($params);
		} else {
			$r->execute();
		}
	}
}
DB::init();