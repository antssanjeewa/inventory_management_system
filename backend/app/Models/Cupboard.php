<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class Cupboard extends Model
{
    use SoftDeletes;

    public function places(): HasMany
    {
        return $this->hasMany(Place::class);
    }
}
