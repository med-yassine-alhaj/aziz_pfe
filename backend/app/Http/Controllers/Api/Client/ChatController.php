<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Http\Resources\ServiceRequestResource;
use App\Models\AppNotification;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function show(ServiceRequest $serviceRequest)
    {
        if ($serviceRequest->client_id !== auth()->id()) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $conversation = $serviceRequest->conversation;

        if (!$conversation) {
            return response()->json(['message' => 'Conversation non trouvée.'], 404);
        }

        // Mark messages as read
        $conversation->messages()
            ->where('sender_id', '!=', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'conversation'   => ['id' => $conversation->id],
            'service_request' => new ServiceRequestResource($serviceRequest->load(['service', 'pack'])),
            'messages'       => MessageResource::collection(
                $conversation->publicMessages()->with('sender')->get()
            ),
        ]);
    }

    public function sendMessage(Request $request, ServiceRequest $serviceRequest)
    {
        if ($serviceRequest->client_id !== auth()->id()) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $request->validate([
            'message'    => ['required_without:attachment', 'nullable', 'string', 'max:5000'],
            'attachment' => ['nullable', 'file', 'max:10240'],
        ]);

        $conversation = $serviceRequest->conversation;

        if (!$conversation) {
            return response()->json(['message' => 'Conversation non trouvée.'], 404);
        }

        $attachmentPath = null;
        $attachmentName = null;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $attachmentPath = $file->store('messages/' . $conversation->id, 'public');
            $attachmentName = $file->getClientOriginalName();
        }

        $message = Message::create([
            'conversation_id'  => $conversation->id,
            'sender_id'        => auth()->id(),
            'message'          => $request->message ?? '',
            'attachment_path'  => $attachmentPath,
            'attachment_name'  => $attachmentName,
            'is_internal_note' => false,
        ]);

        // Notify admin
        if ($conversation->admin_id) {
            AppNotification::create([
                'user_id' => $conversation->admin_id,
                'title'   => 'Nouveau message',
                'message' => auth()->user()->name . ' a envoyé un message.',
                'type'    => 'new_message',
                'link'    => '/admin/requests/' . $serviceRequest->id,
            ]);
        }

        return new MessageResource($message->load('sender'));
    }
}
