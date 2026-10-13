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
        $avantProjet = Service::where('name', 'Avant-projet bâtiment')->first();
        $structure = Service::where('name', 'Étude de structure')->first();
        $plans = Service::where('name', 'Plans d’exécution')->first();
        $chantier = Service::where('name', 'Suivi et coordination de chantier')->first();
        $ouvrage = Service::where('name', 'Ouvrages d’art')->first();
        $rehab = Service::where('name', 'Réhabilitation et diagnostic')->first();

        $starter = Pack::create([
            'name'        => 'Mission avant-projet',
            'slug'        => 'mission-avant-projet',
            'description' => 'Cadrage technique et étude de variantes pour préparer une décision de construction.',
            'badge_label' => 'Sur devis',
            'is_active'   => true,
            'order'       => 1,
        ]);
        $starter->services()->sync(array_filter([
            $avantProjet?->id, $rehab?->id,
        ]));

        $business = Pack::create([
            'name'        => 'Mission structure et exécution',
            'slug'        => 'mission-structure-execution',
            'description' => 'Étude de structure et plans d’exécution adaptés aux caractéristiques du projet.',
            'badge_label' => 'Sur devis',
            'is_active'   => true,
            'order'       => 2,
        ]);
        $business->services()->sync(array_filter([
            $avantProjet?->id, $structure?->id, $plans?->id,
        ]));

        $premium = Pack::create([
            'name'        => 'Mission complète chantier',
            'slug'        => 'mission-complete-chantier',
            'description' => 'Accompagnement des études à la coordination et au suivi technique du chantier.',
            'badge_label' => 'Sur devis',
            'is_active'   => true,
            'order'       => 3,
        ]);
        $premium->services()->sync(array_filter([
            $avantProjet?->id, $structure?->id, $plans?->id, $chantier?->id, $ouvrage?->id,
        ]));
    }
}
