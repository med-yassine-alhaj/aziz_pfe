<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'invoice'                => new InvoiceResource($this->whenLoaded('invoice')),
            'client'                 => new UserResource($this->whenLoaded('client')),
            'amount'                 => (float) $this->amount,
            'method'                 => $this->method,
            'method_label'           => $this->method_label,
            'status'                 => $this->status,
            'status_label'           => $this->status_label,
            'transaction_reference'  => $this->transaction_reference,
            'payment_proof_url'      => $this->payment_proof_url,
            'accountant_comment'     => $this->accountant_comment,
            'validated_by_accountant' => new UserResource($this->whenLoaded('validatedByAccountant')),
            'paid_at'                => $this->paid_at?->format('d/m/Y H:i'),
            'receipt'                => new ReceiptResource($this->whenLoaded('receipt')),
            'created_at'             => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
