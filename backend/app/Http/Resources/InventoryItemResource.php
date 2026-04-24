<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'item_name' => $this->item_name,
            'code' => $this->code,
            'quantity' => $this->quantity,
            'serial_number' => $this->serial_number,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'description' => $this->description,
            'place_id' => $this->place_id,
            'status' => $this->status,
            'place' => new PlaceResource($this->whenLoaded('place')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
