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
            'building_type'      => ['required', 'string', 'max:120'],
            'location'           => ['required', 'string', 'max:255'],
            'approximate_surface'=> ['nullable', 'numeric', 'min:0'],
            'levels_count'       => ['nullable', 'integer', 'min:1', 'max:200'],
            'intervention_type'  => ['required', 'in:new_build,extension,rehabilitation'],
            'requested_mission'  => ['required', 'string', 'max:255'],
            'available_documents'=> ['nullable', 'string', 'max:2000'],
            'approximate_budget' => ['nullable', 'string', 'max:100'],
            'desired_deadline'   => ['nullable', 'date', 'after:today'],
            'files'              => ['nullable', 'array', 'max:5'],
            'files.*'            => ['file', 'max:20480', 'mimes:pdf,dwg,ifc,doc,docx,xls,xlsx,jpg,jpeg,png,zip,rar'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Le titre du projet est requis.',
            'description.required' => 'La description est requise.',
            'description.min'      => 'La description doit contenir au moins 20 caractères.',
            'building_type.required' => 'Le type de bâtiment ou d’ouvrage est requis.',
            'location.required' => 'La localisation est requise.',
            'intervention_type.required' => 'La nature de l’intervention est requise.',
            'requested_mission.required' => 'La mission souhaitée est requise.',
            'desired_deadline.after' => 'La deadline doit être une date future.',
            'files.*.max'          => 'Chaque fichier ne peut pas dépasser 10 Mo.',
        ];
    }
}
