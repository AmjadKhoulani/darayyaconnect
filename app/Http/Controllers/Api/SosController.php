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

        try {
            $alert = SosAlert::create([
                'user_id' => Auth::id(),
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'current_latitude' => $request->latitude,
                'current_longitude' => $request->longitude,
                'emergency_type' => $request->emergency_type ?? 'general',
                'message' => $request->message,
                'status' => 'active'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Emergency signal received. Help is on the way.',
                'alert' => $alert
            ]);
        } catch (\Exception $e) {
            \Log::error('SOS Trigger Failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function status(SosAlert $alert)
    {
        return response()->json([
            'status' => $alert->status,
            'resolved_at' => $alert->resolved_at,
            'current_latitude' => $alert->current_latitude,
            'current_longitude' => $alert->current_longitude,
        ]);
    }

    public function track(Request $request, SosAlert $alert)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        if ($alert->status !== 'active') {
            return response()->json(['message' => 'SOS alert is no longer active'], 400);
        }

        $alert->update([
            'current_latitude' => $request->latitude,
            'current_longitude' => $request->longitude,
        ]);

        return response()->json(['success' => true]);
    }
}
