<?php

namespace App\Http\Requests\API;

use App\Enums\ItemStatus;
use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryItemRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:inventory_items',
            'quantity' => 'required|integer|min:0',
            'serial_number' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'stored_place_id' => 'required|exists:places,id',
            'status' => 'required|in:' . ItemStatus::values(),
        ];
    }
}
