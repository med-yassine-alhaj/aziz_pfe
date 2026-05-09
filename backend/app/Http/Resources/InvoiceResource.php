<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                           => $this->id,
            'invoice_number'               => $this->invoice_number,
            'client'                       => new UserResource($this->whenLoaded('client')),
            'service_request'              => new ServiceRequestResource($this->whenLoaded('serviceRequest')),
            'quote'                        => new QuoteResource($this->whenLoaded('quote')),
            'items'                        => InvoiceItemResource::collection($this->whenLoaded('items')),
            'subtotal'                     => (float) $this->subtotal,
            'discount_amount'              => (float) $this->discount_amount,
            'tax_amount'                   => (float) $this->tax_amount,
            'total'                        => (float) $this->total,
            'status'                       => $this->status,
            'status_label'                 => $this->status_label,
            'notes'                        => $this->notes,
            'due_date'                     => $this->due_date?->format('d/m/Y'),
            'validated_by_accountant'      => new UserResource($this->whenLoaded('validatedByAccountant')),
            'validated_at'                 => $this->validated_at?->format('d/m/Y H:i'),
            'paid_at'                      => $this->paid_at?->format('d/m/Y H:i'),
            'payments'                     => PaymentResource::collection($this->whenLoaded('payments')),
            'receipt'                      => new ReceiptResource($this->whenLoaded('receipt')),
            'created_at'                   => $this->created_at?->format('d/m/Y'),
        ];
    }
}
