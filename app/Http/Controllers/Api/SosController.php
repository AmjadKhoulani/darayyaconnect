<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SosAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SosController extends Controller
{
    public function trigger(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'emergency_type' => 'string|in:general,medical,fire,security',
            'message' => 'nullable|string'
        ]);

        $alert = SosAlert::create([
            'user_id' => Auth::id(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'emergency_type' => $request->emergency_type ?? 'general',
            'message' => $request->message,
            'status' => 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Emergency signal received. Help is on the way.',
            'alert' => $alert
        ]);
    }

    public function status(SosAlert $alert)
    {
        return response()->json([
            'status' => $alert->status,
            'resolved_at' => $alert->resolved_at
        ]);
    }
}
