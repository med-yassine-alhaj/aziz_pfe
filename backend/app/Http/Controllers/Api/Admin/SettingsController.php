<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgencySetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show()
    {
        return response()->json(['settings' => AgencySetting::instance()]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'agency_name'             => ['sometimes', 'string', 'max:200'],
            'email'                   => ['sometimes', 'email'],
            'phone'                   => ['sometimes', 'nullable', 'string'],
            'address'                 => ['sometimes', 'nullable', 'string'],
            'tax_number'              => ['sometimes', 'nullable', 'string'],
            'default_tax_rate'        => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'bank_name'               => ['sometimes', 'nullable', 'string'],
            'bank_account'            => ['sometimes', 'nullable', 'string'],
            'bank_iban'               => ['sometimes', 'nullable', 'string'],
            'invoice_legal_mentions'  => ['sometimes', 'nullable', 'string'],
            'website'                 => ['sometimes', 'nullable', 'url'],
            'logo'                    => ['sometimes', 'nullable', 'image', 'max:2048'],
        ]);

        $settings = AgencySetting::instance();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('agency', 'public');
        }

        $settings->update($data);

        return response()->json(['settings' => $settings->fresh(), 'message' => 'Paramètres mis à jour.']);
    }
}
