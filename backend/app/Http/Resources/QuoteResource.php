<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'quote_number'       => $this->quote_number,
            'client'             => new UserResource($this->whenLoaded('client')),
            'service_request'    => new ServiceRequestResource($this->whenLoaded('serviceRequest')),
            'items'              => QuoteItemResource::collection($this->whenLoaded('items')),
            'subtotal'           => (float) $this->subtotal,
            'discount_amount'    => (float) $this->discount_amount,
            'tax_amount'         => (float) $this->tax_amount,
            'total'              => (float) $this->total,
            'total_ttc'          => (float) $this->total,
            'status'             => $this->status,
            'status_label'       => $this->status_label,
            'notes'              => $this->notes,
            'valid_until'        => $this->valid_until?->format('d/m/Y'),
            'created_by'         => new UserResource($this->whenLoaded('createdBy')),
            'created_at'         => $this->created_at?->format('d/m/Y'),
        ];
    }
}
