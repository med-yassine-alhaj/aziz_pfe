<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class QuoteRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'service_request_id' => ['required', 'exists:service_requests,id'],
            'client_id'          => ['required', 'exists:users,id'],
            'discount_amount'    => ['nullable', 'numeric', 'min:0'],
            'notes'              => ['nullable', 'string'],
            'valid_until'        => ['nullable', 'date', 'after:today'],
            'items'              => ['required', 'array', 'min:1'],
            'items.*.title'      => ['required', 'string'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.quantity'   => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.tax_rate'   => ['required', 'numeric', 'min:0', 'max:100'],
            'items.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
