<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class StoreBorrowingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'borrower_name' => 'required|string|max:255',
            'contact' => 'nullable|string',
            'borrow_date' => 'required|date',
            'expected_return_date' => 'nullable|date|after_or_equal:borrow_date',
            'quantity' => 'required|integer|min:1',
        ];
    }
}
