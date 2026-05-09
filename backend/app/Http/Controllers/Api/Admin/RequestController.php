<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceRequestResource;
use App\Models\ActivityLog;
use App\Models\AppNotification;
use App\Models\Conversation;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceRequest::with(['client', 'service', 'pack', 'assignedAdmin'])
            ->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->search) {
            $query->whereHas('client', fn($q) => $q->where('name', 'like', '%' . $request->search . '%'))
                ->orWhere('title', 'like', '%' . $request->search . '%');
        }

        return ServiceRequestResource::collection($query->paginate(15));
    }

    public function show(ServiceRequest $serviceRequest)
    {
        return new ServiceRequestResource(
            $serviceRequest->load(['client', 'service', 'pack', 'assignedAdmin', 'files', 'conversation', 'quotes'])
        );
    }

    public function updateStatus(Request $request, ServiceRequest $serviceRequest)
    {
        $request->validate([
            'status' => ['required', 'in:' . implode(',', array_keys(ServiceRequest::$statuses))],
        ]);

        $oldStatus = $serviceRequest->status;
        $serviceRequest->update(['status' => $request->status]);

        // Notify client
        AppNotification::create([
            'user_id' => $serviceRequest->client_id,
            'title'   => 'Statut mis à jour',
            'message' => 'Votre demande "' . $serviceRequest->title . '" est maintenant : ' . ServiceRequest::$statuses[$request->status],
            'type'    => 'status_update',
            'link'    => '/client/requests/' . $serviceRequest->id,
        ]);

        ActivityLog::record('status_changed', 'ServiceRequest', $serviceRequest->id,
            "Statut changé de {$oldStatus} vers {$request->status}");

        return new ServiceRequestResource($serviceRequest);
    }

    public function assign(Request $request, ServiceRequest $serviceRequest)
    {
        $request->validate([
            'admin_id' => ['required', 'exists:users,id'],
        ]);

        $admin = User::findOrFail($request->admin_id);
        if (!$admin->isAdmin()) {
            return response()->json(['message' => 'L\'utilisateur n\'est pas un admin.'], 422);
        }

        $serviceRequest->update(['assigned_admin_id' => $request->admin_id]);

        // Auto open conversation if not exists
        if (!$serviceRequest->conversation) {
            Conversation::create([
                'service_request_id' => $serviceRequest->id,
                'client_id'          => $serviceRequest->client_id,
                'admin_id'           => $request->admin_id,
            ]);
            $serviceRequest->update(['status' => 'discussion']);
        }

        return new ServiceRequestResource($serviceRequest->load(['client', 'assignedAdmin', 'conversation']));
    }

    public function openConversation(ServiceRequest $serviceRequest)
    {
        $conversation = $serviceRequest->conversation;

        if (!$conversation) {
            $conversation = Conversation::create([
                'service_request_id' => $serviceRequest->id,
                'client_id'          => $serviceRequest->client_id,
                'admin_id'           => auth()->id(),
            ]);
            $serviceRequest->update([
                'status'            => 'discussion',
                'assigned_admin_id' => auth()->id(),
            ]);

            AppNotification::create([
                'user_id' => $serviceRequest->client_id,
                'title'   => 'Discussion ouverte',
                'message' => 'Un admin a ouvert une discussion sur votre demande : ' . $serviceRequest->title,
                'type'    => 'discussion_opened',
                'link'    => '/client/requests/' . $serviceRequest->id,
            ]);
        }

        return response()->json(['conversation_id' => $conversation->id]);
    }
}
