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
            [
                'name'        => 'Graphic Design',
                'description' => 'Création de visuels professionnels pour vos supports de communication : affiches, flyers, bannières, cartes de visite et bien plus.',
                'icon'        => 'PaintBrushIcon',
                'category'    => 'Design',
                'order'       => 1,
            ],
            [
                'name'        => 'UI/UX Design',
                'description' => 'Conception d\'interfaces utilisateur intuitives et d\'expériences digitales mémorables pour vos applications et sites web.',
                'icon'        => 'DevicePhoneMobileIcon',
                'category'    => 'Design',
                'order'       => 2,
            ],
            [
                'name'        => 'Branding & Identité',
                'description' => 'Création de votre identité visuelle complète : logo, charte graphique, guidelines de marque pour une image cohérente et impactante.',
                'icon'        => 'StarIcon',
                'category'    => 'Design',
                'order'       => 3,
            ],
            [
                'name'        => 'Site Web',
                'description' => 'Développement de sites web modernes, rapides et responsives : vitrine, e-commerce, landing page ou application web sur mesure.',
                'icon'        => 'GlobeAltIcon',
                'category'    => 'Développement',
                'order'       => 4,
            ],
            [
                'name'        => 'Montage Vidéo',
                'description' => 'Production et montage de contenus vidéo professionnels : publicités, clips, reels, motion design et animations pour vos réseaux sociaux.',
                'icon'        => 'FilmIcon',
                'category'    => 'Contenu',
                'order'       => 5,
            ],
            [
                'name'        => 'Communication Générale',
                'description' => 'Stratégie et mise en œuvre de votre plan de communication multicanal pour renforcer votre présence et votre notoriété.',
                'icon'        => 'MegaphoneIcon',
                'category'    => 'Communication',
                'order'       => 6,
            ],
            [
                'name'        => 'Stratégie Marketing',
                'description' => 'Élaboration de stratégies marketing digitales data-driven : SEO, SEA, email marketing, growth hacking et acquisition clients.',
                'icon'        => 'ChartBarIcon',
                'category'    => 'Marketing',
                'order'       => 7,
            ],
            [
                'name'        => 'Stratégie de Communication',
                'description' => 'Définition de votre positionnement, de vos messages clés et de votre stratégie de contenu pour toucher votre audience cible.',
                'icon'        => 'LightBulbIcon',
                'category'    => 'Communication',
                'order'       => 8,
            ],
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
