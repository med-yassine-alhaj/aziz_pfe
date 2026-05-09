<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_id', 'title', 'description',
        'quantity', 'unit_price', 'tax_rate', 'discount_amount', 'total', 'order',
    ];

    protected $casts = [
        'quantity'        => 'decimal:2',
        'unit_price'      => 'decimal:2',
        'tax_rate'        => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total'           => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        static::saving(function ($item) {
            $item->total = ($item->quantity * $item->unit_price) - $item->discount_amount;
        });
    }

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }
}
