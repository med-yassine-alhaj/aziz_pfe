<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PackResource;
use App\Models\Pack;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PackController extends Controller
{
    public function index()
    {
        return PackResource::collection(Pack::with('services')->orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:100', 'unique:packs,name'],
            'description' => ['required', 'string'],
            'badge_label' => ['nullable', 'string', 'max:50'],
            'is_active'   => ['boolean'],
            'order'       => ['nullable', 'integer'],
            'service_ids' => ['nullable', 'array'],
            'service_ids.*' => ['exists:services,id'],
        ]);

        $pack = Pack::create([
            ...$data,
            'slug' => Str::slug($data['name']),
        ]);

        if (!empty($data['service_ids'])) {
            $pack->services()->sync($data['service_ids']);
        }

        return new PackResource($pack->load('services'));
    }

    public function update(Request $request, Pack $pack)
    {
        $data = $request->validate([
            'name'        => ['sometimes', 'string', 'max:100'],
            'description' => ['sometimes', 'string'],
            'badge_label' => ['nullable', 'string', 'max:50'],
            'is_active'   => ['boolean'],
            'order'       => ['nullable', 'integer'],
            'service_ids' => ['nullable', 'array'],
            'service_ids.*' => ['exists:services,id'],
        ]);

        $pack->update($data);

        if (isset($data['service_ids'])) {
            $pack->services()->sync($data['service_ids']);
        }

        return new PackResource($pack->fresh()->load('services'));
    }

    public function destroy(Pack $pack)
    {
        $pack->delete();

        return response()->json(['message' => 'Pack supprimé.']);
    }
}
