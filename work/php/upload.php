<?php

if(isset($_POST['arr'])) {

	$db = new mysqli('localhost','root','root','detection');

	if($db == false) exit(0);

	$arr = $_POST['arr'];

	$key = pack('H*', "bcb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3");

	$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
    $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);

	$ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key,
                                 $plaintext, MCRYPT_MODE_CBC, $iv);

	$ciphertext = $iv.$ciphertext;

    $ciphertext_base64 = base64_encode($ciphertext);

	$res = $db->query("INSERT INTO users_data('img','date') VALUES ($ciphertext_base64, date())");

	if($res != false) {
		exit(1);
	}
} else {
	exit(0);
}

?>