<?php

namespace App\Models;

use App\Enums\ItemStatus;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['item_name', 'code', 'quantity', 'serial_number', 'image', 'description', 'place_id', 'status'])]
class InventoryItem extends Model
{
    use SoftDeletes, LogsActivity;

    protected function casts(): array
    {
        return [
            'status' => ItemStatus::class
        ];
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }
}
