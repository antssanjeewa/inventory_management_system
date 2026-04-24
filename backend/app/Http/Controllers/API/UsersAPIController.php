<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreUserRequest;
use App\Http\Requests\API\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;

class UsersAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = User::paginate();
        return response()->apiSuccessPaginated(UserResource::collection($items));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());

        return response()->apiSuccess(new UserResource($user), 'User created successfully', 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());

        return response()->apiSuccess($user, 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if (auth()->user()->id === $user->id) {
            return response()->apiError('Cannot delete itself', 400);
        }

        $user->delete();

        return response()->apiSuccess(null, 'User deleted successfully');
    }
}
