<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id', 'service_id', 'pack_id', 'title', 'description',
        'approximate_budget', 'desired_deadline', 'status', 'assigned_admin_id',
    ];

    protected $casts = [
        'desired_deadline' => 'date',
    ];

    public static array $statuses = [
        'pending'           => 'En attente',
        'discussion'        => 'En discussion',
        'quote_sent'        => 'Devis envoyé',
        'quote_accepted'    => 'Devis accepté',
        'quote_refused'     => 'Devis refusé',
        'invoice_generated' => 'Facture générée',
        'payment_pending'   => 'Paiement en attente',
        'paid'              => 'Payée',
        'in_progress'       => 'En cours',
        'completed'         => 'Terminée',
        'cancelled'         => 'Annulée',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }

    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_admin_id');
    }

    public function files()
    {
        return $this->hasMany(RequestFile::class);
    }

    public function conversation()
    {
        return $this->hasOne(Conversation::class);
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::$statuses[$this->status] ?? $this->status;
    }
}
