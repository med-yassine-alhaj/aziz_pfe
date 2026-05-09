<?php
$opts = ['http'=>['method'=>'GET','header'=>"Accept: application/json\r\n",'ignore_errors'=>true]];
$context = stream_context_create($opts);
$content = @file_get_contents('http://127.0.0.1:8000/api/services', false, $context);
$code = 'N/A';
if (isset($http_response_header) && count($http_response_header) > 0) {
    if (preg_match('#HTTP/.* ([0-9]+)#', $http_response_header[0], $m)) {
        $code = $m[1];
    }
}
echo $code . PHP_EOL;
echo ($content === false ? 'NO BODY' : substr($content, 0, 200)) . PHP_EOL;
