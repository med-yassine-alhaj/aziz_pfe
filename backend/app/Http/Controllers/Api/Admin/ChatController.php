<?php

namespace App\Http\Controllers\Api\Admin;

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
        $conversation = $serviceRequest->conversation;

        if (!$conversation) {
            return response()->json(['message' => 'Conversation non trouvée.'], 404);
        }

        // Mark as read for admin
        $conversation->messages()
            ->where('sender_id', '!=', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'conversation'    => ['id' => $conversation->id],
            'service_request' => new ServiceRequestResource($serviceRequest->load(['client', 'service', 'pack'])),
            'messages'        => MessageResource::collection(
                $conversation->messages()->with('sender')->get()
            ),
        ]);
    }

    public function sendMessage(Request $request, ServiceRequest $serviceRequest)
    {
        $request->validate([
            'message'          => ['nullable', 'string', 'max:5000'],
            'attachment'       => ['nullable', 'file', 'max:10240'],
            'is_internal_note' => ['boolean'],
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

        $isInternal = (bool) $request->is_internal_note;

        $message = Message::create([
            'conversation_id'  => $conversation->id,
            'sender_id'        => auth()->id(),
            'message'          => $request->message ?? '',
            'attachment_path'  => $attachmentPath,
            'attachment_name'  => $attachmentName,
            'is_internal_note' => $isInternal,
        ]);

        // Notify client only for public messages
        if (!$isInternal) {
            AppNotification::create([
                'user_id' => $serviceRequest->client_id,
                'title'   => 'Nouveau message',
                'message' => 'Un admin vous a répondu.',
                'type'    => 'new_message',
                'link'    => '/client/requests/' . $serviceRequest->id,
            ]);
        }

        return new MessageResource($message->load('sender'));
    }
}
