<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=fmcom;charset=utf8mb4', 'root', '');
    $res = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables:\n";
    foreach ($res as $t) echo "- $t\n";
} catch (Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
