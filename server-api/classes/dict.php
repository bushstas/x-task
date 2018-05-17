<?php

define('DEFAULT_LANG', 'ru');

class Dict {
	private static $lang;
	
	static function init() {
		self::$lang = $_REQUEST['lang'];
		if (empty(self::$lang)) {
			self::$lang = DEFAULT_LANG;
		}
	}

	static function get() {
		include __DIR__.'/dictionary/index.php';
	}

	static function getTooltip() {
		$name = $_REQUEST['name'];
		$language = self::$lang;
		$path = __DIR__.'/dictionary/help/'.$name.'.php';
		$tooltip = null;
		if (file_exists($path)) {
			include $path;
			if (is_array($help)) {
				$tooltip = array($name => $help);
			}
		}
		if (!is_array($tooltip)) {
			error('Подсказка не найдена');
		}
		success(array('tooltip' => $tooltip));
	}

	static function getDictionary() {
		success(array(
			'dict' => self::getByName($_REQUEST['name'])
		));
	}

	static function getByName($names) {
		$language = self::$lang;
		$dicts = array();
		if (!is_array($names)) {
			$names = array($names);
		}
		foreach ($names as $name) {
			$path = __DIR__.'/dictionary/'.$name.'.php';
			if (file_exists($path)) {
				include $path;
				if (is_array($dict)) {
					$dicts = array_merge($dicts, $dict);
				}
			}
		}
		return $dicts;
	}

	static function getLang() {
		return self::$lang;
	}
}

Dict::init();