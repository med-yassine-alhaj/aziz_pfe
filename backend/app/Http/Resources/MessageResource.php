<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'conversation_id'  => $this->conversation_id,
            'sender'           => new UserResource($this->whenLoaded('sender')),
            'message'          => $this->message,
            'attachment_url'   => $this->attachment_url,
            'attachment_name'  => $this->attachment_name,
            'is_internal_note' => $this->is_internal_note,
            'is_read'          => $this->is_read,
            'created_at'       => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
