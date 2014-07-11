<?php
if(isset($_COOKIE["save-game"])) {
	$playerID = $_COOKIE["save-game"];
}
else {
	$bytes = openssl_random_pseudo_bytes(64);
	$playerID = bin2hex($bytes);
}

setcookie("save-game", $playerID, strtotime("+6 months"));