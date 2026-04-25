<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BorrowingResource extends JsonResource
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
            'inventory_item_id' => $this->inventory_item_id,
            'inventory_item' => new InventoryItemResource($this->whenLoaded('inventoryItem')),
            'borrower_name' => $this->borrower_name,
            'contact' => $this->contact,
            'borrow_date' => $this->borrow_date,
            'expected_return_date' => $this->expected_return_date,
            'quantity' => $this->quantity,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
