<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['inventory_item_id','borrower_name','contact','borrow_date','expected_return_date','quantity','status'])]
class Borrowing extends Model
{
    use SoftDeletes;
    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
