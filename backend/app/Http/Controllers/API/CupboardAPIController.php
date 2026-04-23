<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreCupboardRequest;
use App\Http\Requests\API\UpdateCupboardRequest;
use App\Models\Cupboard;

class CupboardAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Cupboard::paginate();
        return response()->apiSuccess($items);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCupboardRequest $request)
    {
        $cupboard = Cupboard::create($request->validated());

        return response()->apiSuccess($cupboard, 'Cupboard created successfully', 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCupboardRequest $request, Cupboard $cupboard)
    {
        $cupboard->update($request->validated());

        return response()->apiSuccess($cupboard, 'Cupboard updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cupboard $cupboard)
    {
        $cupboard->delete();

        return response()->apiSuccess(null, 'Cupboard deleted successfully');
    }
}
