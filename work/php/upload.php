<?php

if(isset($_POST['arr'])) {

	$arr = $_POST['arr'];

	$key = 'ejfvhejfhdsfjerb';

	$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
	$iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);

	$ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $arr, MCRYPT_MODE_CBC, $iv);

	$ciphertext = $iv.$ciphertext;

	$ciphertext_base64 = base64_encode($ciphertext);

	exit($ciphertext_base64);
} else {
	exit(0);
}

?>