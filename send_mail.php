<?php

$email=$_POST['tujuan'];
$subject=$_POST['judul'];
$message=$_POST['message'];

$to=$email;

$message="From:$tujuan <br />".$message;

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=iso-8859-1" . "\r\n";

// More headers
$headers .= 'From: <info@yourdomain.com>' . "\r\n";
$headers .= 'Cc: admin@yourdomain.com' . "\r\n";


if($_POST)
{
	mail($to, $subject, $message)
}
?>