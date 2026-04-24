<?php

use App\Http\Controllers\API\PlaceAPIController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthAPIController;
use App\Http\Controllers\API\CupboardAPIController;
use App\Http\Controllers\API\InventoryItemAPIController;
use App\Http\Controllers\API\BorrowingAPIController;

// auth
Route::post('/login', [AuthAPIController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthAPIController::class, 'logout']);


    // Route::post('/users', [UserController::class, 'store'])->middleware('role:admin');

    Route::apiResource('cupboards', CupboardAPIController::class);
    Route::apiResource('places', PlaceAPIController::class);

    Route::apiResource('inventory-items', InventoryItemAPIController::class);
    Route::apiResource('borrowings', BorrowingAPIController::class);
});