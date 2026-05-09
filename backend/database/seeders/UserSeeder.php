<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin F_MCOM',
            'email'    => 'admin@fmcom.ma',
            'phone'    => '+212600000001',
            'password' => Hash::make('Admin@2024'),
            'role'     => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Comptable F_MCOM',
            'email'    => 'comptable@fmcom.ma',
            'phone'    => '+212600000002',
            'password' => Hash::make('Comptable@2024'),
            'role'     => 'accountant',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Youssef Alami',
            'email'    => 'youssef@test.ma',
            'phone'    => '+212612345678',
            'password' => Hash::make('Client@2024'),
            'role'     => 'client',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Fatima Zahra',
            'email'    => 'fatima@test.ma',
            'phone'    => '+212698765432',
            'password' => Hash::make('Client@2024'),
            'role'     => 'client',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Mohamed Benali',
            'email'    => 'mohamed@test.ma',
            'phone'    => '+212655555555',
            'password' => Hash::make('Client@2024'),
            'role'     => 'client',
            'is_active' => true,
        ]);
    }
}
