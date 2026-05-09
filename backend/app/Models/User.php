<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'phone', 'password',
        'role', 'google_id', 'avatar', 'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // --- Scopes ---
    public function scopeClients($query)   { return $query->where('role', 'client'); }
    public function scopeAdmins($query)    { return $query->where('role', 'admin'); }
    public function scopeAccountants($query) { return $query->where('role', 'accountant'); }

    // --- Helpers ---
    public function isAdmin(): bool      { return $this->role === 'admin'; }
    public function isClient(): bool     { return $this->role === 'client'; }
    public function isAccountant(): bool { return $this->role === 'accountant'; }

    // --- Relations ---
    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class, 'client_id');
    }

    public function assignedRequests()
    {
        return $this->hasMany(ServiceRequest::class, 'assigned_admin_id');
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'client_id');
    }

    public function adminConversations()
    {
        return $this->hasMany(Conversation::class, 'admin_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class, 'client_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'client_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'client_id');
    }

    public function receipts()
    {
        return $this->hasMany(Receipt::class, 'client_id');
    }

    public function notifications()
    {
        return $this->hasMany(AppNotification::class, 'user_id');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return '/storage/' . $this->avatar;
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=7C3AED&background=F1EAFE';
    }
}
