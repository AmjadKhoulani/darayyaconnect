<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceState;
use Illuminate\Http\Request;

class ServiceStateController extends Controller
{
    public function index()
    {
        return response()->json(ServiceState::where('is_active', true)->get());
    }

    public function update(Request $request, $key)
    {
        $request->validate([
            'status_text' => 'required|string',
            'status_color' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $service = ServiceState::where('service_key', $key)->firstOrFail();
        
        $service->update([
            'status_text' => $request->status_text,
            'status_color' => $request->status_color,
            'is_active' => $request->has('is_active') ? $request->is_active : $service->is_active,
            'last_updated_at' => now()
        ]);

        return response()->json($service);
    }
}
