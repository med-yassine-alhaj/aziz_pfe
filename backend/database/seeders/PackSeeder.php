<?php

namespace Database\Seeders;

use App\Models\Pack;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PackSeeder extends Seeder
{
    public function run(): void
    {
        $graphicDesign = Service::where('name', 'Graphic Design')->first();
        $uiux          = Service::where('name', 'UI/UX Design')->first();
        $branding      = Service::where('name', 'Branding & Identité')->first();
        $website       = Service::where('name', 'Site Web')->first();
        $video         = Service::where('name', 'Montage Vidéo')->first();
        $communication = Service::where('name', 'Communication Générale')->first();
        $marketing     = Service::where('name', 'Stratégie Marketing')->first();
        $stratComm     = Service::where('name', 'Stratégie de Communication')->first();

        $starter = Pack::create([
            'name'        => 'Pack Starter',
            'slug'        => 'pack-starter',
            'description' => 'Idéal pour les TPE et startups souhaitant lancer leur présence digitale avec les essentiels.',
            'badge_label' => 'Sur devis',
            'is_active'   => true,
            'order'       => 1,
        ]);
        $starter->services()->sync(array_filter([
            $graphicDesign?->id,
            $branding?->id,
            $communication?->id,
        ]));

        $business = Pack::create([
            'name'        => 'Pack Business',
            'slug'        => 'pack-business',
            'description' => 'Pour les PME qui veulent accélérer leur croissance avec une présence digitale complète et une stratégie solide.',
            'badge_label' => 'Sur devis',
            'is_active'   => true,
            'order'       => 2,
        ]);
        $business->services()->sync(array_filter([
            $graphicDesign?->id,
            $uiux?->id,
            $branding?->id,
            $website?->id,
            $marketing?->id,
        ]));

        $premium = Pack::create([
            'name'        => 'Pack Premium',
            'slug'        => 'pack-premium',
            'description' => 'Solution 360° pour les entreprises ambitieuses. Couvrez tous les aspects de votre communication digitale.',
            'badge_label' => 'Sur devis',
            'is_active'   => true,
            'order'       => 3,
        ]);
        $premium->services()->sync(array_filter([
            $graphicDesign?->id,
            $uiux?->id,
            $branding?->id,
            $website?->id,
            $video?->id,
            $communication?->id,
            $marketing?->id,
            $stratComm?->id,
        ]));
    }
}
