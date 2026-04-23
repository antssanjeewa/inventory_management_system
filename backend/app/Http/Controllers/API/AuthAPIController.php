<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthAPIController extends Controller
{
    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|min:6',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->apiError('Invalid credentials', [], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('api-token')->plainTextToken;
        $user['access_token'] = $token;

        return response()->apiSuccess($user);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->apiSuccess(null, 'Logged out successfully');
    }
}
