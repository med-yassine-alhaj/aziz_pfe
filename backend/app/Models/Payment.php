<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id', 'client_id', 'amount', 'method', 'status',
        'transaction_reference', 'payment_proof', 'accountant_comment',
        'validated_by_accountant_id', 'paid_at',
    ];

    protected $casts = [
        'amount'  => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public static array $methods = [
        'manual'        => 'Paiement manuel',
        'online_mock'   => 'Paiement en ligne',
        'bank_transfer' => 'Virement bancaire',
        'cash'          => 'Espèces',
    ];

    public static array $statuses = [
        'pending'  => 'En attente',
        'success'  => 'Validé',
        'failed'   => 'Échoué',
        'rejected' => 'Rejeté',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function validatedByAccountant()
    {
        return $this->belongsTo(User::class, 'validated_by_accountant_id');
    }

    public function receipt()
    {
        return $this->hasOne(Receipt::class);
    }

    public function getPaymentProofUrlAttribute(): ?string
    {
        return $this->payment_proof ? asset('storage/' . $this->payment_proof) : null;
    }

    public function getStatusLabelAttribute(): string
    {
        return self::$statuses[$this->status] ?? $this->status;
    }

    public function getMethodLabelAttribute(): string
    {
        return self::$methods[$this->method] ?? $this->method;
    }
}
