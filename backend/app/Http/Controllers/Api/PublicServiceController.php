<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;

class PublicServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)
            ->orderBy('order')
            ->get();

        return ServiceResource::collection($services);
    }

    public function show(Service $service)
    {
        if (!$service->is_active) {
            return response()->json(['message' => 'Service non disponible.'], 404);
        }

        return new ServiceResource($service);
    }
}
