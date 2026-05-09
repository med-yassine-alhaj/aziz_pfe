<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceFormRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $serviceId = $this->route('service');
        return [
            'name'        => ['required', 'string', 'max:100', Rule::unique('services', 'name')->ignore($serviceId)],
            'description' => ['required', 'string'],
            'icon'        => ['nullable', 'string'],
            'image'       => ['nullable', 'image', 'max:2048'],
            'category'    => ['nullable', 'string', 'max:100'],
            'order'       => ['nullable', 'integer', 'min:0'],
            'is_active'   => ['boolean'],
        ];
    }
}
