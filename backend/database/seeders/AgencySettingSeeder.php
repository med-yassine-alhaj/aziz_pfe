<?php

namespace Database\Seeders;

use App\Models\AgencySetting;
use Illuminate\Database\Seeder;

class AgencySettingSeeder extends Seeder
{
    public function run(): void
    {
        AgencySetting::create([
            'agency_name'            => 'ENGINEERIUM SARL',
            'email'                  => 'fradi.hichem@gmail.com',
            'phone'                  => '+216 71 766 100',
            'address'                => 'Appartement D2, résidence La Tulipe, Centre urbain nord, 1082 Tunis',
            'tax_number'             => 'IF-XXXXXXX',
            'default_tax_rate'       => 20.00,
            'bank_name'              => 'Attijariwafa Bank',
            'bank_account'           => 'XXXXXXXXXXXXXXXXXX',
            'invoice_legal_mentions' => 'ENGINEERIUM SARL — Bureau d’études en bâtiments et ouvrages d’art — Tunis.',
            'website'                => null,
            'social_links'           => [
                'linkedin'  => null,
            ],
        ]);
    }
}
