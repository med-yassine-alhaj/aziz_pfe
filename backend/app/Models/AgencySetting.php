<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgencySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_name', 'logo', 'email', 'phone', 'address',
        'tax_number', 'default_tax_rate', 'bank_name', 'bank_account',
        'bank_iban', 'invoice_legal_mentions', 'website', 'social_links',
    ];

    protected $casts = [
        'social_links'     => 'array',
        'default_tax_rate' => 'decimal:2',
    ];

    public static function instance(): self
    {
        return static::firstOrCreate([], [
            'agency_name'     => 'F_MCOM',
            'email'           => 'contact@fmcom.ma',
            'default_tax_rate' => 20.00,
        ]);
    }

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? asset('storage/' . $this->logo) : null;
    }
}
