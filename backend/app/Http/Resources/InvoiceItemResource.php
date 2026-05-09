<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'title'           => $this->title,
            'description'     => $this->description,
            'quantity'        => (float) $this->quantity,
            'unit_price'      => (float) $this->unit_price,
            'tax_rate'        => (float) $this->tax_rate,
            'discount_amount' => (float) $this->discount_amount,
            'total'           => (float) $this->total,
            'order'           => $this->order,
        ];
    }
}
