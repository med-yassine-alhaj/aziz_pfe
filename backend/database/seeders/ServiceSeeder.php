<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['name' => 'Avant-projet bâtiment', 'description' => 'Analyse du besoin, études de variantes et pièces d’avant-projet pour bâtiments.', 'icon' => 'BuildingOfficeIcon', 'category' => 'Bâtiments', 'order' => 1],
            ['name' => 'Étude de structure', 'description' => 'Dimensionnement et justification des structures en béton armé, acier ou maçonnerie.', 'icon' => 'CubeIcon', 'category' => 'Structures', 'order' => 2],
            ['name' => 'Plans d’exécution', 'description' => 'Production et contrôle des plans, détails et documents nécessaires à l’exécution.', 'icon' => 'DocumentTextIcon', 'category' => 'Exécution', 'order' => 3],
            ['name' => 'Ouvrages d’art', 'description' => 'Études d’ouvrages d’art et analyse des solutions techniques adaptées au site.', 'icon' => 'RectangleGroupIcon', 'category' => 'Ouvrages d’art', 'order' => 4],
            ['name' => 'Suivi et coordination de chantier', 'description' => 'Suivi technique, coordination des intervenants, contrôle des documents et observations.', 'icon' => 'ClipboardDocumentCheckIcon', 'category' => 'Chantier', 'order' => 5],
            ['name' => 'Réhabilitation et diagnostic', 'description' => 'Diagnostic de l’existant, analyse des désordres et études de renforcement.', 'icon' => 'WrenchScrewdriverIcon', 'category' => 'Réhabilitation', 'order' => 6],
        ];

        foreach ($services as $service) {
            Service::create([
                ...$service,
                'slug'      => Str::slug($service['name']),
                'is_active' => true,
            ]);
        }
    }
}
