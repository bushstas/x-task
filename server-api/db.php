<?php

$host = "tanyushka.mysql";
$dbname = "tanyushka_xtask";
$user = "tanyushka_mysql";
$pass = "RL/mch1b";

$db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 