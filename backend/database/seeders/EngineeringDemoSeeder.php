<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\ProjectStageHistory;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class EngineeringDemoSeeder extends Seeder
{
    public function run(): void
    {
        $request = ServiceRequest::query()->where('title', 'Immeuble démonstration')->first();
        $engineer = User::query()->where('email', 'ingenieur.demo@engineerium.test')->first();

        if (!$request || !$engineer) {
            return;
        }

        $request->update([
            'building_type' => $request->building_type ?: 'Immeuble résidentiel',
            'location' => $request->location ?: 'Tunis',
            'approximate_surface' => $request->approximate_surface ?: 1250,
            'levels_count' => $request->levels_count ?: 5,
            'intervention_type' => $request->intervention_type ?: 'new_build',
            'requested_mission' => $request->requested_mission ?: 'Étude de structure',
            'available_documents' => $request->available_documents ?: 'Plan architectural PDF, relevé topographique fictif',
        ]);

        $project = Project::updateOrCreate(
            ['service_request_id' => $request->id],
            [
                'client_id' => $request->client_id,
                'responsible_engineer_id' => $engineer->id,
                'reference' => 'ENG-2026-00001',
                'name' => 'Immeuble démonstration — ENGINEERIUM',
                'technical_stage' => 'documents_to_complete',
                'technical_progress' => 15,
                'start_date' => now()->toDateString(),
                'due_date' => now()->addDays(45)->toDateString(),
                'notes' => 'Données de démonstration ENGINEERIUM — ne pas utiliser pour une mission réelle.',
            ]
        );

        if (!$project->stageHistories()->exists()) {
            ProjectStageHistory::create([
                'project_id' => $project->id,
                'user_id' => $engineer->id,
                'from_stage' => null,
                'to_stage' => 'documents_to_complete',
                'comment' => 'Initialisation du dossier de démonstration ENGINEERIUM.',
            ]);
        }

        if (!$project->documents()->exists()) {
            $contents = "%PDF-1.4\n% ENGINEERIUM DEMO\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n";
            $firstPath = 'projects/' . $project->id . '/demo-plan-v1.pdf';
            $secondPath = 'projects/' . $project->id . '/demo-plan-v2.pdf';
            Storage::disk('local')->put($firstPath, $contents);
            Storage::disk('local')->put($secondPath, $contents);

            ProjectDocument::create([
                'project_id' => $project->id,
                'uploaded_by' => $engineer->id,
                'category' => 'Plan d’exécution — DEMO',
                'original_name' => 'plan-execution-demo-v1.pdf',
                'path' => $firstPath,
                'mime_type' => 'application/pdf',
                'size' => strlen($contents),
                'version' => 1,
                'state' => 'draft',
                'observations' => 'Version initiale fictive pour démonstration.',
            ]);
            ProjectDocument::create([
                'project_id' => $project->id,
                'uploaded_by' => $engineer->id,
                'category' => 'Plan d’exécution — DEMO',
                'original_name' => 'plan-execution-demo-v2.pdf',
                'path' => $secondPath,
                'mime_type' => 'application/pdf',
                'size' => strlen($contents),
                'version' => 2,
                'state' => 'to_review',
                'observations' => 'Nouvelle version fictive à vérifier.',
            ]);
        }
    }
}
