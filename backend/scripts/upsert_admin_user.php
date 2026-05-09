<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$name = $argv[1] ?? 'Admin F_MCOM';
$email = $argv[2] ?? 'admin@fmcom.ma';
$phone = $argv[3] ?? '+212600000001';
$password = $argv[4] ?? 'Admin@2024';

$user = User::updateOrCreate(
    ['email' => $email],
    [
        'name' => $name,
        'phone' => $phone,
        'password' => Hash::make($password),
        'role' => 'admin',
        'is_active' => true,
    ]
);

echo "Admin user ready: {$user->email}\n";
echo "Password: {$password}\n";
echo "Role: {$user->role}\n";
