<?php

namespace App\Http\Controllers\API;

use App\Enums\ItemStatus;
use App\Models\Borrowing;
use App\Models\InventoryItem;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreBorrowingRequest;
use App\Http\Requests\API\UpdateBorrowingRequest;
use App\Http\Resources\BorrowingResource;
use Illuminate\Support\Facades\DB;

class BorrowingAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $borrowings = Borrowing::with('inventoryItem')->where('status', 'Borrowed')->latest()->paginate(15);
        return response()->apiSuccessPaginated(BorrowingResource::collection($borrowings));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBorrowingRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $item = InventoryItem::where('id', $request->inventory_item_id)
                ->lockForUpdate()
                ->firstOrFail();
            $old_item = $item->toArray();

            if ($item->quantity < $request->quantity) {
                return response()->apiError('Insufficient stock available.', [], 422);
            }

            $borrowing = Borrowing::create(array_merge($request->validated(), [
                'status' => 'Borrowed'
            ]));

            $item->decrement('quantity', $request->quantity);
            $item->refresh();

            if ($item->quantity == 0) {
                $item->status = ItemStatus::BORROWED;
                $item->save();
                $item->logActivity('Status Changed', $old_item, $item->toArray());
            }

            $borrowing->logActivity('Item Borrowed', null, $borrowing->toArray());
            $item->logActivity('Quantity Changed', $old_item, $item->toArray());

            return response()->apiSuccess(new BorrowingResource($borrowing), 'Item borrowed successfully', 201);
        });
    }

    /**
     * Update the specified resource in storage (Return process).
     */
    public function update(UpdateBorrowingRequest $request, Borrowing $borrowing)
    {
        return DB::transaction(function () use ($request, $borrowing) {
            $borrowing = Borrowing::where('id', $borrowing->id)
                ->lockForUpdate()
                ->firstOrFail();

            $oldStatus = $borrowing->status;
            $newStatus = $request->status;
            $oldData = $borrowing->toArray();

            if ($oldStatus === 'Borrowed' && $newStatus === 'Returned') {
                $item = InventoryItem::where('id', $borrowing->inventory_item_id)
                    ->lockForUpdate()
                    ->firstOrFail();
                $old_item = $item->toArray();

                $item->increment('quantity', $borrowing->quantity);
                $item->refresh();

                if ($item->status === ItemStatus::BORROWED) {
                    $item->update(['status' => ItemStatus::IN_STORE]);
                    $item->logActivity('Status Changed', $old_item, $item->toArray());
                }

                $item->logActivity('Quantity Changed', $old_item, $item->toArray());
            }

            $borrowing->update($request->validated());

            $borrowing->logActivity('Item Returned', $oldData, $borrowing->toArray());

            return response()->apiSuccess(new BorrowingResource($borrowing), 'Borrowing status updated successfully');
        });
    }

    /**
     * Get borrowing history for a specific inventory item.
     */
    public function byItem(InventoryItem $inventoryItem)
    {
        $borrowings = Borrowing::where('inventory_item_id', $inventoryItem->id)
            ->latest()
            ->paginate(10);

        return response()->apiSuccessPaginated(BorrowingResource::collection($borrowings));
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
