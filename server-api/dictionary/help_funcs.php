<?php

class Help {
	private static $captions = array(),
				   $subcaptions = array(),
				   $lines = array(),
				   $codes = array(),
				   $caption = -1,
				   $subcaption = -1,
				   $line = -1,
				   $code = -1;


	static function init($data) {
		if (is_array($data['captions'])) {
			self::$captions = $data['captions'];
		}
		if (is_array($data['subcaptions'])) {
			self::$subcaptions = $data['subcaptions'];
		}
		if (is_array($data['lines'])) {
			self::$lines = $data['lines'];
		}
		if (is_array($data['codes'])) {
			self::$codes = $data['codes'];
		}
	}

	static function getSpace() {
		return array('type' => 'br');
	}
	
	static function getCaption() {
		self::$caption++;
		return array('type' => 'cap', 'value' => self::$captions[self::$caption]);
	}

	static function getSubcaption() {
		self::$subcaption++;
		return array('type' => 'cap2', 'value' => self::$subcaptions[self::$subcaption]);
	}

	static function getLine() {
		self::$line++;
		return array('type' => 'l', 'value' => self::$lines[self::$line]);
	}

	static function getCode() {
		self::$code++;
		return array('type' => 'c', 'value' => self::$codes[self::$code]);
	}
}