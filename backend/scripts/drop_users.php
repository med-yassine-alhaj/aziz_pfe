<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=fmcom;charset=utf8mb4', 'root', '');
    $pdo->exec('DROP TABLE IF EXISTS `users`');
    echo "Dropped users table\n";
} catch (Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
