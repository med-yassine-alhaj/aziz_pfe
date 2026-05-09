<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'receipt_number' => $this->receipt_number,
            'amount'         => (float) $this->amount,
            'pdf_url'        => $this->pdf_url,
            'client'         => new UserResource($this->whenLoaded('client')),
            'created_at'     => $this->created_at?->format('d/m/Y'),
        ];
    }
}
