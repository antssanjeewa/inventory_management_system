<?php

use App\Http\Controllers\API\PlaceAPIController;
use App\Http\Controllers\API\UsersAPIController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthAPIController;
use App\Http\Controllers\API\CupboardAPIController;
use App\Http\Controllers\API\InventoryItemAPIController;
use App\Http\Controllers\API\BorrowingAPIController;
use App\Http\Controllers\API\ActivityLogAPIController;

// auth
Route::post('/login', [AuthAPIController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthAPIController::class, 'logout']);

    Route::apiResource('cupboards', CupboardAPIController::class);
    Route::apiResource('places', PlaceAPIController::class);

    Route::apiResource('inventory-items', InventoryItemAPIController::class);
    Route::apiResource('borrowings', BorrowingAPIController::class);

    Route::apiResource('users', UsersAPIController::class)->middleware('role:admin');
    Route::get('activity-logs', [ActivityLogAPIController::class, 'index'])->middleware('role:admin');
});