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
	$params = [];

	if(!empty($args)) {
		$params = $args[0];		
	}

	$params["ID_Player"] = $_COOKIE["save-game"];

	try {
		$stmt = $this->dbh->prepare($sql);

		foreach ($params as $key => $value) {
			$paramKey = ":" . $key;

			if(strstr($sql, $paramKey)) {
				$stmt->bindValue($paramKey, $value);
			}
		}

		$stmt->execute();		
	}
	catch(\PDOException $e) {
		return new Database_Error($e->getMessage());
	}

	return new Database_Result($stmt);
}

}#Database

class Database_Result implements \Iterator, \ArrayAccess, \JsonSerializable {

private $rows;
private $rowIndex = null;

public function __construct($stmt) {
	$this->stmt = $stmt;

}

public function __get($name) {
	switch($name) {
	case "length":
		$this->fetch();
		return count($this->rows);

		break;

	default:
		$this->fetch();
		return $this->rows[0]->$name;
		break;
	}
}

private function fetch() {
	if(is_null($this->rowIndex)) {
		$this->rowIndex = 0;
		$this->rows = $this->stmt->fetchAll(
			Dal::FETCH_CLASS, "Game\Database_Result_Row"
		);		
	}
}

public function jsonSerialize() {
	$this->fetch();
	return $this->rows;
}

// Iterator ----------------------------------------------------------------
public function current() {
	$this->fetch();
	return $this->rows[$this->rowIndex];
}

public function key() {
	$this->fetch();
	return $this->rowIndex;
}

public function next() {
	$this->fetch();
	++$this->rowIndex;
}

public function rewind() {
	$this->fetch();
	$this->rowIndex = 0;
}

public function valid() {
	$this->fetch();
	return isset($this->rows[$this->rowIndex]);
}
// End: Iterator -----------------------------------------------------------

// ArrayAccess -------------------------------------------------------------
public function offsetExists($offset) {
	if(!is_numeric($offset)) {
		// Looking for the first result's column.
		if(isset($this->rows[0])) {
			return array_key_exists($offset, $this->rows[0]);
		}
	}
			
	return array_key_exists($offset, $this->rows);
}

public function offsetGet($offset) {
	if(!is_numeric($offset)) {
		if(isset($this->rows[0])) {
			return $this->rows[0][$offset];
		}
	}
	return $this->rows[$offset];
}

public function offsetSet($offset, $value) {
	throw new BadMethodCallException("Trying to set a result field.");
}

public function offsetUnset($offset) {
	throw new BadMethodCallException("Trying to unset a result field.");
}

}#Database_Result

// TODO: Maybe we don't need jsonserialisable...
class Database_Result_Row extends Response implements \JsonSerializable {

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