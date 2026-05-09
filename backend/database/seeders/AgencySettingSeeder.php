<?php

namespace Database\Seeders;

use App\Models\AgencySetting;
use Illuminate\Database\Seeder;

class AgencySettingSeeder extends Seeder
{
    public function run(): void
    {
        AgencySetting::create([
            'agency_name'            => 'F_MCOM',
            'email'                  => 'contact@fmcom.ma',
            'phone'                  => '+212 5XX-XXXXXX',
            'address'                => 'Casablanca, Maroc',
            'tax_number'             => 'IF-XXXXXXX',
            'default_tax_rate'       => 20.00,
            'bank_name'              => 'Attijariwafa Bank',
            'bank_account'           => 'XXXXXXXXXXXXXXXXXX',
            'invoice_legal_mentions' => 'F_MCOM — Agence de Communication Digitale — Casablanca, Maroc. TVA applicable selon la législation en vigueur.',
            'website'                => 'https://fmcom.ma',
            'social_links'           => [
                'instagram' => 'https://instagram.com/fmcom',
                'linkedin'  => 'https://linkedin.com/company/fmcom',
                'facebook'  => 'https://facebook.com/fmcom',
            ],
        ]);
    }
}
