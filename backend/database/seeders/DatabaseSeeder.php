<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AgencySettingSeeder::class,
            UserSeeder::class,
            ServiceSeeder::class,
            PackSeeder::class,
        ]);
    }
}
