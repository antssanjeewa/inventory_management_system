<?php

namespace App\Http\Controllers\API;

use App\Enums\ItemStatus;
use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\Place;
use App\Models\Borrowing;
use App\Models\ActivityLog;
use App\Http\Resources\ActivityLogResource;

class DashboardAPIController extends Controller
{
    public function index()
    {
        $stats = [
            'total_items' => InventoryItem::count(),
            'total_places' => Place::count(),
            'active_borrowings' => Borrowing::where('status', ItemStatus::BORROWED)->count(),
            'missing_count' => InventoryItem::whereIn('status', [ItemStatus::DAMAGED, ItemStatus::MISSING])->count(),
        ];

        $latestActivities = ActivityLog::with('user')
            ->latest()
            ->take(5)
            ->get();

        return response()->apiSuccess([
            'stats' => $stats,
            'latest_activities' => ActivityLogResource::collection($latestActivities)
        ]);
    }
}
