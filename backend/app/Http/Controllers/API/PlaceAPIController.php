<?php

namespace App\Http\Controllers\API;

use App\Models\Place;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\StorePlaceRequest;
use App\Http\Requests\API\UpdatePlaceRequest;
use App\Http\Resources\PlaceResource;

class PlaceAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Place::query();

        if ($request->has('cupboard_id')) {
            $query->where('cupboard_id', $request->cupboard_id);
        }

        $items = $query->withCount('items')->paginate();
        return response()->apiSuccessPaginated(PlaceResource::collection($items));
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
