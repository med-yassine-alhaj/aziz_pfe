<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=fmcom;charset=utf8mb4', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('SET FOREIGN_KEY_CHECKS=0');
    $tables = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'fmcom'")->fetchAll(PDO::FETCH_COLUMN);
    if (empty($tables)) {
        echo "No tables to drop\n";
    } else {
        foreach ($tables as $t) {
            $pdo->exec("DROP TABLE IF EXISTS `" . $t . "`");
            echo "Dropped: $t\n";
        }
    }
    $pdo->exec('SET FOREIGN_KEY_CHECKS=1');
    echo "All tables dropped.\n";
} catch (Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
