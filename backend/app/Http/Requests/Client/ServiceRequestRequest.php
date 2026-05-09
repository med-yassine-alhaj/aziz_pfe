<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class ServiceRequestRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'service_id'         => ['nullable', 'exists:services,id'],
            'pack_id'            => ['nullable', 'exists:packs,id'],
            'title'              => ['required', 'string', 'min:5', 'max:200'],
            'description'        => ['required', 'string', 'min:20'],
            'approximate_budget' => ['nullable', 'string', 'max:100'],
            'desired_deadline'   => ['nullable', 'date', 'after:today'],
            'files'              => ['nullable', 'array', 'max:5'],
            'files.*'            => ['file', 'max:10240', 'mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,zip,rar'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Le titre du projet est requis.',
            'description.required' => 'La description est requise.',
            'description.min'      => 'La description doit contenir au moins 20 caractères.',
            'desired_deadline.after' => 'La deadline doit être une date future.',
            'files.*.max'          => 'Chaque fichier ne peut pas dépasser 10 Mo.',
        ];
    }
}
