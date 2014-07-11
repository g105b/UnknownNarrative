<?php
namespace Game;
use \StdClass as Obj;

require "Class/Response.php";
require "Class/Database.php";

$db = new Database();

$response = $db->getPlayer(["ID_Player" => $_COOKIE["save-game"]]);

if(!empty($_POST)) {

}

header("Content-Type: application/json");
echo json_encode($response);