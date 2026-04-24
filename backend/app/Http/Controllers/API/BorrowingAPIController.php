<?php

namespace App\Http\Controllers\API;

use App\Enums\ItemStatus;
use App\Models\Borrowing;
use App\Models\InventoryItem;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreBorrowingRequest;
use App\Http\Requests\API\UpdateBorrowingRequest;
use Illuminate\Support\Facades\DB;

class BorrowingAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $borrowings = Borrowing::with('inventoryItem')->paginate();
        return response()->apiSuccess($borrowings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBorrowingRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $item = InventoryItem::findOrFail($request->inventory_item_id);

            if ($item->quantity < $request->quantity) {
                return response()->apiError('Insufficient stock available.', 422);
            }

            $borrowing = Borrowing::create(array_merge($request->validated(), [
                'status' => 'Borrowed'
            ]));

            $item->decrementQuantity($request->quantity);

            // If it was the last of the items, mark status as Borrowed
            if ($item->quantity == 0) {
                $item->status = ItemStatus::BORROWED;
                $item->save();
            }

            return response()->apiSuccess($borrowing, 'Item borrowed successfully', 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Borrowing $borrowing)
    {
        $borrowing->load('inventoryItem');
        return response()->apiSuccess($borrowing);
    }

    /**
     * Update the specified resource in storage (Return process).
     */
    public function update(UpdateBorrowingRequest $request, Borrowing $borrowing)
    {
        return DB::transaction(function () use ($request, $borrowing) {
            $oldStatus = $borrowing->status;
            $newStatus = $request->status;

            if ($oldStatus === 'Borrowed' && $newStatus === 'Returned') {
                $item = $borrowing->inventoryItem;
                $item->incrementQuantity($borrowing->quantity);

                // If it's back in store, ensure status is In-Store
                if ($item->status === ItemStatus::BORROWED) {
                    $item->status = ItemStatus::IN_STORE;
                    $item->save();
                }
            }

            $borrowing->update($request->validated());

            return response()->apiSuccess($borrowing, 'Borrowing status updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Borrowing $borrowing)
    {
        $borrowing->delete();
        return response()->apiSuccess(null, 'Borrowing record deleted successfully');
    }
}
