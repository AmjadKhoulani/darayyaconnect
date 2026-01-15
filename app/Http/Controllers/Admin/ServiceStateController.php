<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceState;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceStateController extends Controller
{
    public function index()
    {
        $services = ServiceState::all();
        return Inertia::render('Admin/Services/Status', [
            'services' => $services
        ]);
    }

    public function update(Request $request, $key)
    {
        $validated = $request->validate([
            'status_text' => 'sometimes|string',
            'status_color' => 'sometimes|string',
            'is_active' => 'sometimes|boolean'
        ]);

        $service = ServiceState::where('service_key', $key)->firstOrFail();
        
        $service->update(array_merge(
            $validated,
            ['last_updated_at' => now()]
        ));

        return redirect()->back();
    }
}
