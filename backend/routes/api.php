<?php

use App\Http\Controllers\API\PlaceAPIController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthAPIController;
use App\Http\Controllers\API\CupboardAPIController;

// auth
Route::post('/login', [AuthAPIController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthAPIController::class, 'logout']);


    // Route::post('/users', [UserController::class, 'store'])->middleware('role:admin');


    Route::apiResource('cupboards', CupboardAPIController::class);
    Route::apiResource('places', PlaceAPIController::class);
});