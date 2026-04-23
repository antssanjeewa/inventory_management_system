<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['item_name','code','quantity','serial_number','image','description','stored_place_id','status'])]
class InventoryItem extends Model
{
    use SoftDeletes;

    public function place()
    {
        return $this->belongsTo(Place::class, 'stored_place_id');
    }

    public function incrementQuantity($amount = 1)
    {
        $this->quantity += $amount;
        $this->save();
    }

    public function decrementQuantity($amount = 1)
    {
        if ($this->quantity >= $amount) {
            $this->quantity -= $amount;
            $this->save();
        }
    }
}
