<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\ProjectStageHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    private const TRANSITIONS = [
        'documents_to_complete' => ['study_in_progress'],
        'study_in_progress' => ['internal_review', 'documents_to_complete'],
        'internal_review' => ['documents_transmitted', 'study_in_progress'],
        'documents_transmitted' => ['observations_to_process', 'mission_closed'],
        'observations_to_process' => ['internal_review', 'documents_transmitted'],
        'mission_closed' => [],
    ];

    public function index()
    {
        $user = auth()->user();
        $query = Project::with(['client', 'responsibleEngineer', 'request']);
        if ($user->isClient()) $query->where('client_id', $user->id);
        if ($user->isEngineer()) $query->where('responsible_engineer_id', $user->id);
        return response()->json(['data' => $query->latest()->paginate(15)]);
    }

    public function show(Project $project)
    {
        $this->authorizeProject($project);
        return response()->json(['data' => $project->load([
            'client', 'responsibleEngineer', 'request', 'documents.uploader', 'stageHistories.user', 'invoices',
        ])]);
    }

    public function updateStage(Request $request, Project $project)
    {
        $this->authorizeProject($project, true);
        $data = $request->validate([
            'technical_stage' => ['required', Rule::in(array_keys(Project::STAGES))],
            'technical_progress' => ['required', 'integer', 'min:0', 'max:100'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);
        $old = $project->technical_stage;
        if ($old !== $data['technical_stage'] && !in_array($data['technical_stage'], self::TRANSITIONS[$old] ?? [], true)) {
            return response()->json(['message' => 'Transition technique non autorisée depuis cette étape.'], 422);
        }

        $project->update([
            'technical_stage' => $data['technical_stage'],
            'technical_progress' => $data['technical_progress'],
        ]);
        ProjectStageHistory::create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'from_stage' => $old,
            'to_stage' => $data['technical_stage'],
            'comment' => $data['comment'] ?? null,
        ]);
        $project->client->notifications()->create([
            'title' => 'Avancement du projet mis à jour',
            'message' => $project->name . ' : ' . $project->stage_label,
            'type' => 'project_stage_updated',
            'link' => '/client/projects/' . $project->id,
        ]);
        return $this->show($project->fresh());
    }

    public function assignEngineer(Request $request, Project $project)
    {
        abort_unless(auth()->user()->isAdmin(), 403);
        $data = $request->validate(['engineer_id' => ['required', 'exists:users,id']]);
        $engineer = \App\Models\User::whereKey($data['engineer_id'])->where('role', 'engineer')->first();
        if (!$engineer) return response()->json(['message' => 'L’utilisateur sélectionné n’est pas ingénieur.'], 422);
        $project->update(['responsible_engineer_id' => $engineer->id]);
        $engineer->notifications()->create([
            'title' => 'Projet affecté',
            'message' => 'Le projet ' . $project->name . ' vous a été affecté.',
            'type' => 'project_assigned',
            'link' => '/engineer/projects/' . $project->id,
        ]);
        return response()->json(['data' => $project->fresh(['responsibleEngineer'])]);
    }

    public function storeDocument(Request $request, Project $project)
    {
        $this->authorizeProject($project, true);
        $data = $request->validate([
            'category' => ['required', 'string', 'max:100'],
            'observations' => ['nullable', 'string', 'max:2000'],
            'state' => ['nullable', Rule::in(['draft', 'to_review', 'validated'])],
            'file' => ['required', 'file', 'max:51200', 'mimes:pdf,dwg,ifc'],
        ]);
        $file = $data['file'];
        $version = ((int) $project->documents()->where('category', $data['category'])->max('version')) + 1;
        $path = $file->store('projects/' . $project->id, 'local');
        $document = ProjectDocument::create([
            'project_id' => $project->id,
            'uploaded_by' => auth()->id(),
            'category' => $data['category'],
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'version' => $version,
            'state' => $data['state'] ?? 'to_review',
            'observations' => $data['observations'] ?? null,
        ]);
        return response()->json(['data' => $document->load('uploader')], 201);
    }

    public function downloadDocument(Project $project, ProjectDocument $document)
    {
        $this->authorizeProject($project);
        abort_unless($document->project_id === $project->id, 404);
        abort_unless(Storage::disk('local')->exists($document->path), 404);
        return Storage::disk('local')->download($document->path, $document->original_name);
    }

    private function authorizeProject(Project $project, bool $write = false): void
    {
        $user = auth()->user();
        $allowed = $user->isAdmin()
            || ($user->isClient() && $project->client_id === $user->id)
            || ($user->isEngineer() && $project->responsible_engineer_id === $user->id);
        abort_unless($allowed && (!$write || !$user->isClient()), 403);
    }
}
