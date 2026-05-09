<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PackResource;
use App\Models\Pack;

class PublicPackController extends Controller
{
    public function index()
    {
        $packs = Pack::with('services')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return PackResource::collection($packs);
    }

    public function show(Pack $pack)
    {
        if (!$pack->is_active) {
            return response()->json(['message' => 'Pack non disponible.'], 404);
        }

        return new PackResource($pack->load('services'));
    }
}
