<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectDocument extends Model
{
    protected $fillable = [
        'project_id', 'uploaded_by', 'category', 'original_name', 'path',
        'mime_type', 'size', 'version', 'state', 'observations',
    ];

    public function project() { return $this->belongsTo(Project::class); }
    public function uploader() { return $this->belongsTo(User::class, 'uploaded_by'); }
}
