<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number', 'client_id', 'service_request_id', 'quote_id',
        'subtotal', 'discount_amount', 'tax_amount', 'total',
        'status', 'notes', 'due_date',
        'validated_by_accountant_id', 'validated_at', 'paid_at', 'created_by',
    ];

    protected $casts = [
        'due_date'      => 'date',
        'validated_at'  => 'datetime',
        'paid_at'       => 'datetime',
        'subtotal'      => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount'    => 'decimal:2',
        'total'         => 'decimal:2',
    ];

    public static array $statuses = [
        'draft'                         => 'Brouillon',
        'waiting_accountant_validation' => 'En attente de validation',
        'unpaid'                        => 'Non payée',
        'payment_pending'               => 'Paiement en attente',
        'paid'                          => 'Payée',
        'cancelled'                     => 'Annulée',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $invoice->invoice_number = 'FAC-' . date('Y') . '-' . str_pad(Invoice::count() + 1, 5, '0', STR_PAD_LEFT);
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

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('order');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function receipt()
    {
        return $this->hasOne(Receipt::class);
    }

    public function validatedByAccountant()
    {
        return $this->belongsTo(User::class, 'validated_by_accountant_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function recalculate(): void
    {
        $subtotal = $this->items->sum('total');
        $taxAmount = $this->items->sum(fn($item) => $item->total * ($item->tax_rate / 100));
        $this->update([
            'subtotal'   => $subtotal,
            'tax_amount' => $taxAmount,
            'total'      => $subtotal + $taxAmount - $this->discount_amount,
        ]);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::$statuses[$this->status] ?? $this->status;
    }
}
