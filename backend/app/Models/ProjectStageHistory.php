<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectStageHistory extends Model
{
    protected $fillable = ['project_id', 'user_id', 'from_stage', 'to_stage', 'comment'];
    public function project() { return $this->belongsTo(Project::class); }
    public function user() { return $this->belongsTo(User::class); }
}
