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
            'building_type'       => $this->building_type,
            'location'            => $this->location,
            'approximate_surface' => $this->approximate_surface,
            'levels_count'        => $this->levels_count,
            'intervention_type'   => $this->intervention_type,
            'requested_mission'   => $this->requested_mission,
            'available_documents' => $this->available_documents,
            'project_id'          => $this->project?->id,
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
