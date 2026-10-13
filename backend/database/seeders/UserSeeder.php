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
            'name'     => 'Administrateur ENGINEERIUM (démo)',
            'email'    => 'admin.demo@engineerium.test',
            'phone'    => '+21671000001',
            'password' => Hash::make('Admin@2024'),
            'role'     => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Comptable ENGINEERIUM (démo)',
            'email'    => 'comptable.demo@engineerium.test',
            'phone'    => '+21671000002',
            'password' => Hash::make('Comptable@2024'),
            'role'     => 'accountant',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Ingénieur ENGINEERIUM (démo)',
            'email'    => 'ingenieur.demo@engineerium.test',
            'phone'    => '+21671000003',
            'password' => Hash::make('Ingenieur@2024'),
            'role'     => 'engineer',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Client bâtiment (démo)',
            'email'    => 'client.batiment@engineerium.test',
            'phone'    => '+21671000004',
            'password' => Hash::make('Client@2024'),
            'role'     => 'client',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Client ouvrage (démo)',
            'email'    => 'client.ouvrage@engineerium.test',
            'phone'    => '+21671000005',
            'password' => Hash::make('Client@2024'),
            'role'     => 'client',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Client réhabilitation (démo)',
            'email'    => 'client.rehabilitation@engineerium.test',
            'phone'    => '+21671000006',
            'password' => Hash::make('Client@2024'),
            'role'     => 'client',
            'is_active' => true,
        ]);
    }
}
