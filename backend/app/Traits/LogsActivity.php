<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait LogsActivity
{
    public function logActivity($action, $oldValues = null, $newValues = null)
    {
        $this->activities()->create([
            'user_id' => auth()->id(),
            'action' => $action,
            'old_values' => $oldValues,
            'new_values' => $newValues,
        ]);
    }

    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'entity');
    }
}
