<?php

$db = new mysqli('localhost','model_user','Crocodile13','detection');

if($db == false) exit("Не удалось подключиться к базе данных!");

if(isset($_POST['val'])) {

	$val = htmlspecialchars($_POST['val']);
	$val = stripcslashes($val);
	$val = $db->real_escape_string($val);

	$res = $db->query("SELECT * FROM user WHERE user_id='$val'");

	if($res->num_rows > 0) {

        $i = 0;

		while($row = $res->fetch_assoc()) {
			$arr[$i++] = $row;
		}

		exit(json_encode($arr));
	} else {
		exit("Не получилось получить данные!");
	}
} else {
	exit("Ошибка! Значение не получено!");
}

?>