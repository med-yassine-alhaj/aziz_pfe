<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\ServiceRequestRequest;
use App\Http\Resources\ServiceRequestResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\RequestFile;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;

class ServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = $user->serviceRequests()
            ->with(['service', 'pack', 'assignedAdmin'])
            ->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return ServiceRequestResource::collection($query->paginate(10));
    }

    public function show(ServiceRequest $serviceRequest)
    {
        $this->authorize('view', $serviceRequest);

        return new ServiceRequestResource(
            $serviceRequest->load(['service', 'pack', 'client', 'assignedAdmin', 'files', 'conversation'])
        );
    }

    public function store(ServiceRequestRequest $request)
    {
        $serviceRequest = ServiceRequest::create([
            'client_id'          => auth()->id(),
            'service_id'         => $request->service_id,
            'pack_id'            => $request->pack_id,
            'title'              => $request->title,
            'description'        => $request->description,
            'approximate_budget' => $request->approximate_budget,
            'desired_deadline'   => $request->desired_deadline,
            'status'             => 'pending',
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('requests/' . $serviceRequest->id, 'public');
                RequestFile::create([
                    'service_request_id' => $serviceRequest->id,
                    'file_path'          => $path,
                    'file_name'          => $file->getClientOriginalName(),
                    'file_type'          => $file->getMimeType(),
                    'file_size'          => $file->getSize(),
                ]);
            }
        }

        // Notify all admins
        User::admins()->each(function ($admin) use ($serviceRequest) {
            AppNotification::create([
                'user_id' => $admin->id,
                'title'   => 'Nouvelle demande reçue',
                'message' => auth()->user()->name . ' a envoyé une nouvelle demande : ' . $serviceRequest->title,
                'type'    => 'new_request',
                'link'    => '/admin/requests/' . $serviceRequest->id,
            ]);
        });

        ActivityLog::record('created', 'ServiceRequest', $serviceRequest->id, 'Nouvelle demande créée : ' . $serviceRequest->title);

        return new ServiceRequestResource($serviceRequest->load(['service', 'pack', 'files']));
    }
}
