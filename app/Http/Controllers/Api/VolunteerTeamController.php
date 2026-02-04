<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VolunteerTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VolunteerTeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = VolunteerTeam::where('status', 'approved');

        if ($request->has('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'logo' => 'nullable|image|max:2048',
            'contact_info' => 'nullable|array',
            'city_id' => 'required|exists:cities,id',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('teams', 'public');
        }

        $team = VolunteerTeam::create([
            'user_id' => $request->user()->id,
            'city_id' => $validated['city_id'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'logo' => $logoPath,
            'contact_info' => $validated['contact_info'] ?? [],
            'status' => 'pending'
        ]);

        return response()->json($team, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $team = VolunteerTeam::with('opportunities')->findOrFail($id);
        
        // Only show approved teams or own team
        if ($team->status !== 'approved' && $team->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($team);
    }
    
    /**
     * Get the current user's team.
     */
    public function myTeam(Request $request)
    {
        $team = VolunteerTeam::where('user_id', $request->user()->id)->first();
        return response()->json($team);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $team = VolunteerTeam::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'logo' => 'nullable|image|max:2048',
            'contact_info' => 'nullable|array',
        ]);

        if ($request->hasFile('logo')) {
            if ($team->logo) {
                Storage::disk('public')->delete($team->logo);
            }
            $validated['logo'] = $request->file('logo')->store('teams', 'public');
        }

        $team->update($validated);

        return response()->json($team);
    }
}
