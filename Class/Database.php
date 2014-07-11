<?php
namespace Game;
use \PDO as Dal;

class Database {

private $dbh = null;
private $serviceDirectory;

public function __construct() {
	$this->serviceDirectory = realpath(__DIR__ . "/../Service");
	$this->dbh = new Dal(
		"mysql:host=localhost;dbname=unk-nar;charset=utf8",
		"unk-dba",
		"unk-pwd", [
			Dal::ATTR_EMULATE_PREPARES 		=> false,
			Dal::ATTR_ERRMODE 				=> Dal::ERRMODE_EXCEPTION,
			Dal::ATTR_DEFAULT_FETCH_MODE 	=> Dal::FETCH_OBJ,
		]
	);
}

public function __call($name, $params) {
	$sqlPath = "{$this->serviceDirectory}/$name.sql";
	if(!file_exists($sqlPath)) {
		throw new \BadMethodCallException("Service $name does not exist.");
	}

	$sql = file_get_contents($sqlPath);

	try {
		$stmt = $this->dbh->prepare($sql);

		foreach ($params as $key => $value) {
			$stmt->bindValue(":" . $key, $value);
		}

		$stmt->execute();		
	}
	catch(\PDOException $e) {
		return new Database_Error($e->getMessage());
	}

	return $stmt->fetchAll();
}

}#Database

class Database_Error implements Response {

private $msg = "";

public function __construct($msg) {
	$this->msg = preg_replace("/(SQLSTATE\[[0-9A-Z]*\]: )/", "", $msg);
}

public function output() {
	$obj = new \StdClass();
	$obj->error = $this->msg;
	return $obj;
}

public function __toString() {
	return $this->msg;
}

}#Database_Error