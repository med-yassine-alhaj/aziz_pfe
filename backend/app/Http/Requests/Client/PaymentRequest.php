<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'method'        => ['required', 'in:manual,online_mock,bank_transfer,cash'],
            'payment_proof' => ['nullable', 'file', 'max:5120', 'mimes:pdf,jpg,jpeg,png'],
            'transaction_reference' => ['nullable', 'string', 'max:200'],
        ];
    }

    public function messages(): array
    {
        return [
            'method.required' => 'Le mode de paiement est requis.',
            'payment_proof.max' => 'Le fichier de preuve ne peut pas dépasser 5 Mo.',
        ];
    }
}
