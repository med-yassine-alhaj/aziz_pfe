<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'description'         => $this->description,
            'approximate_budget'  => $this->approximate_budget,
            'desired_deadline'    => $this->desired_deadline?->format('d/m/Y'),
            'status'              => $this->status,
            'status_label'        => $this->status_label,
            'client'              => new UserResource($this->whenLoaded('client')),
            'service'             => new ServiceResource($this->whenLoaded('service')),
            'pack'                => new PackResource($this->whenLoaded('pack')),
            'assigned_admin'      => new UserResource($this->whenLoaded('assignedAdmin')),
            'files'               => RequestFileResource::collection($this->whenLoaded('files')),
            'has_conversation'    => $this->whenLoaded('conversation', fn() => $this->conversation !== null, false),
            'conversation_id'     => $this->whenLoaded('conversation', fn() => $this->conversation?->id),
            'created_at'          => $this->created_at?->format('d/m/Y H:i'),
            'updated_at'          => $this->updated_at?->format('d/m/Y H:i'),
        ];
    }
}
