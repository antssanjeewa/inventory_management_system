<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['inventory_item_id', 'borrower_name', 'contact', 'borrow_date', 'expected_return_date', 'quantity', 'status'])]
class Borrowing extends Model
{
    use SoftDeletes, LogsActivity;
    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
