<?php

namespace App\Http\Controllers\API;

use App\Models\ActivityLog;
use App\Http\Resources\ActivityLogResource;
use App\Http\Controllers\Controller;

class ActivityLogAPIController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with('user')->latest()->paginate(20);
        return response()->apiSuccessPaginated(ActivityLogResource::collection($logs));
    }
}
