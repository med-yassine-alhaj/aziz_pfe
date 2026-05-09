<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'receipt_number', 'payment_id', 'invoice_id', 'client_id', 'amount', 'pdf_path',
    ];

    protected $casts = ['amount' => 'decimal:2'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($receipt) {
            if (empty($receipt->receipt_number)) {
                $receipt->receipt_number = 'REC-' . date('Y') . '-' . str_pad(Receipt::count() + 1, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function getPdfUrlAttribute(): ?string
    {
        return $this->pdf_path ? asset('storage/' . $this->pdf_path) : null;
    }
}
