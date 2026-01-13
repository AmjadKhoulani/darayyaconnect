<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function updateLocation(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('📍 Location Update Request:', $request->all());

        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'is_resident' => 'boolean',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user->update([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'is_resident' => $request->is_resident ?? $user->is_resident,
            'location_verified_at' => now(),
        ]);

        return response()->json(['message' => 'Location updated successfully']);
    }
}
