<?php

namespace App\Http\Controllers\API;

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
            'active_borrowings' => Borrowing::where('status', 'Borrowed')->count(),
            'low_stock_count' => InventoryItem::where('status', 'Low-Stock')->count(),
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
