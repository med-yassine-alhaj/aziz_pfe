<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Pack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'badge_label', 'is_active', 'order',
    ];

    protected $casts = ['is_active' => 'boolean'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($pack) {
            if (empty($pack->slug)) {
                $pack->slug = Str::slug($pack->name);
            }
        });
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'pack_services');
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class);
    }
}
