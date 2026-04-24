<?php

namespace App\Http\Requests\API;

use App\Enums\ItemStatus;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryItemRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'item_name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:255|unique:inventory_items,code,' . $this->inventory_item->id,
            'quantity' => 'sometimes|required|integer|min:0',
            'serial_number' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'description' => 'nullable|string',
            'place_id' => 'sometimes|required|exists:places,id',
            'status' => 'sometimes|required|in:' . implode(',', ItemStatus::values()),
        ];
    }
}
