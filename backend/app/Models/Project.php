<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    public const STAGES = [
        'documents_to_complete' => 'Documents à compléter',
        'study_in_progress' => 'Étude en cours',
        'internal_review' => 'Contrôle interne',
        'documents_transmitted' => 'Documents transmis',
        'observations_to_process' => 'Observations à traiter',
        'mission_closed' => 'Mission clôturée',
    ];

    protected $fillable = [
        'service_request_id', 'client_id', 'responsible_engineer_id', 'reference',
        'name', 'technical_stage', 'technical_progress', 'start_date', 'due_date', 'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
    ];

    public function request() { return $this->belongsTo(ServiceRequest::class, 'service_request_id'); }
    public function client() { return $this->belongsTo(User::class, 'client_id'); }
    public function responsibleEngineer() { return $this->belongsTo(User::class, 'responsible_engineer_id'); }
    public function stageHistories() { return $this->hasMany(ProjectStageHistory::class); }
    public function documents() { return $this->hasMany(ProjectDocument::class); }
    public function invoices() { return $this->hasMany(Invoice::class, 'service_request_id', 'service_request_id'); }

    public function getStageLabelAttribute(): string
    {
        return self::STAGES[$this->technical_stage] ?? $this->technical_stage;
    }
}
