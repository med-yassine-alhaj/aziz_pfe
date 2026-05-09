<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$name = $argv[1] ?? 'Comptable F_MCOM';
$email = $argv[2] ?? 'comptable@fmcom.ma';
$phone = $argv[3] ?? '+212600000002';
$password = $argv[4] ?? 'Comptable@2024';

$user = User::updateOrCreate(
    ['email' => $email],
    [
        'name' => $name,
        'phone' => $phone,
        'password' => Hash::make($password),
        'role' => 'accountant',
        'is_active' => true,
    ]
);

echo "Accountant user ready: {$user->email}\n";
echo "Password: {$password}\n";
echo "Role: {$user->role}\n";
