<?php
namespace Game;
require "Class/Response.php";
require "Class/Database.php";

$db = new Database();

$state = $db->getState();

if(!empty($_POST)) {

}

header("Content-Type: application/json");
echo json_encode($state->output());