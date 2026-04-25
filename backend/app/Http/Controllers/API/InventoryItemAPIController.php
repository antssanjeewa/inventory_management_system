<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreInventoryItemRequest;
use App\Http\Requests\API\UpdateInventoryItemRequest;
use App\Http\Resources\InventoryItemResource;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InventoryItemAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = InventoryItem::query()->with('place');

        // Optional filtering
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('stored_place_id')) {
            $query->where('stored_place_id', $request->stored_place_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $items = $query->latest()->paginate();
        return response()->apiSuccessPaginated(InventoryItemResource::collection($items));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInventoryItemRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('inventory', 'public');
        }

        $inventoryItem = InventoryItem::create($data);

        $inventoryItem->logActivity('Inventory Item Created', null, $inventoryItem->toArray());

        return response()->apiSuccess(new InventoryItemResource($inventoryItem), 'Inventory item created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryItem $inventoryItem)
    {
        $inventoryItem->load('place');
        return response()->apiSuccess(new InventoryItemResource($inventoryItem));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventoryItem)
    {
        return DB::transaction(function () use ($request, $inventoryItem) {
            $data = $request->validated();
            $oldData = $inventoryItem->toArray();

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('inventory', 'public');
            }

            $inventoryItem->update($data);

            if (isset($data['image']) && $oldData['image']) {
                Storage::disk('public')->delete($oldData['image']);
            }

            $inventoryItem->logActivity('Inventory Item Updated', $oldData, $inventoryItem->toArray());

            return response()->apiSuccess(new InventoryItemResource($inventoryItem), 'Inventory item updated successfully');
        });
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
