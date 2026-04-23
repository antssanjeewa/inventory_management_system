<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id','action','entity_type','entity_id','old_values','new_values'])]
class ActivityLog extends Model
{
    use SoftDeletes;
}