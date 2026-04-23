<?php

namespace App\Http\Controllers\API;

use App\Models\Place;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\StorePlaceRequest;
use App\Http\Requests\API\UpdatePlaceRequest;

class PlaceAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Place::paginate();
        return response()->apiSuccess($items);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePlaceRequest $request)
    {
        $place = Place::create($request->validated());

        return response()->apiSuccess($place, 'Place created successfully', 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlaceRequest $request, Place $place)
    {
        $place->update($request->validated());

        return response()->apiSuccess($place, 'Place updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Place $place)
    {
        $place->delete();

        return response()->apiSuccess(null, 'Place deleted successfully');
    }
}
