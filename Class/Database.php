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
		]
	);
}

public function __call($name, $args) {
	$sqlPath = "{$this->serviceDirectory}/$name.sql";
	if(!file_exists($sqlPath)) {
		throw new \BadMethodCallException("Service $name does not exist.");
	}

	$sql = file_get_contents($sqlPath);
	$params = $args[0];

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

	return $stmt->fetchAll(Dal::FETCH_CLASS, "Game\Database_Result");
}

}#Database

class Database_Result extends Response implements \JsonSerializable {

public function jsonSerialize() {
	return "TEST FROM OUTPUT";
}

}#Database_Result

class Database_Error extends Response implements \JsonSerializable {

private $msg = "";

public function __construct($msg) {
	$this->msg = preg_replace("/(SQLSTATE\[[0-9A-Z]*\]: )/", "", $msg);
}

public function jsonSerialize() {
	$this->error = $this->msg;
	return $this;
}

}#Database_Error