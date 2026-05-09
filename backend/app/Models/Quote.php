<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_number', 'client_id', 'service_request_id',
        'subtotal', 'discount_amount', 'tax_amount', 'total',
        'status', 'notes', 'valid_until', 'created_by',
    ];

    protected $casts = [
        'valid_until' => 'date',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public static array $statuses = [
        'draft'     => 'Brouillon',
        'sent'      => 'Envoyé',
        'accepted'  => 'Accepté',
        'refused'   => 'Refusé',
        'expired'   => 'Expiré',
        'cancelled' => 'Annulé',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($quote) {
            if (empty($quote->quote_number)) {
                $quote->quote_number = 'DEV-' . date('Y') . '-' . str_pad(Quote::count() + 1, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function serviceRequest()
    {
        return $this->belongsTo(ServiceRequest::class);
    }

    public function items()
    {
        return $this->hasMany(QuoteItem::class)->orderBy('order');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function recalculate(): void
    {
        $subtotal = $this->items->sum('total');
        $taxAmount = $this->items->sum(fn($item) => $item->total * ($item->tax_rate / 100));
        $this->update([
            'subtotal'        => $subtotal,
            'tax_amount'      => $taxAmount,
            'total'           => $subtotal + $taxAmount - $this->discount_amount,
        ]);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::$statuses[$this->status] ?? $this->status;
    }
}
