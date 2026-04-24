<?php

namespace App\Http\Controllers\API;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreInventoryItemRequest;
use App\Http\Requests\API\UpdateInventoryItemRequest;
use App\Http\Resources\InventoryItemResource;

class InventoryItemAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = InventoryItem::with('place')->paginate();
        return response()->apiSuccessPaginated(InventoryItemResource::collection($items));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInventoryItemRequest $request)
    {
        $inventoryItem = InventoryItem::create($request->validated());

        return response()->apiSuccess($inventoryItem, 'Inventory item created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryItem $inventoryItem)
    {
        $inventoryItem->load('place');
        return response()->apiSuccess($inventoryItem);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventoryItem)
    {
        $inventoryItem->update($request->validated());

        return response()->apiSuccess($inventoryItem, 'Inventory item updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryItem $inventoryItem)
    {
        $inventoryItem->delete();

        return response()->apiSuccess(null, 'Inventory item deleted successfully');
    }
}
