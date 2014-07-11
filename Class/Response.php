<?php
namespace Game;

class Response {

protected $obj;

public function __construct() {
	$this->obj = new ResponseProperty();
}

}#Response

class ResponseProperty {

public function __get($name) {
	if(!isset($this->$name)) {
		$this->$name = new ResponseProperty();
	}

	return $this->$name;
}

public function __set($name, $value) {
	$this->$name = $value;
}

}#ResponseProperty