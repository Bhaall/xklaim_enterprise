<?php
	header('Content-type: application/csv');
	header('Content-Disposition: attachment; filename="' . $_POST['name'] .'"');

	$encoded = $_POST['csvdata'];

	function utf8_urldecode($str) {
		$str = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;",urldecode($str));
		return html_entity_decode($str,null,'UTF-8');;
	}

	$decoded = utf8_urldecode($encoded);

	echo $decoded;
?>