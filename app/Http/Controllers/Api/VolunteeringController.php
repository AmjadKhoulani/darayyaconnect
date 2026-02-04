<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VolunteerOpportunity;
use App\Models\VolunteerApplication;
use Illuminate\Support\Facades\Auth;

class VolunteeringController extends Controller
{
    public function index()
    {
        $opportunities = VolunteerOpportunity::where('status', 'open')
            ->where('moderation_status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($opportunities);
    }

    public function show($id)
    {
        $opportunity = VolunteerOpportunity::withCount('applications')->findOrFail($id);
        return response()->json($opportunity);
    }

    public function apply(Request $request, $id)
    {
        $request->validate([
            'availability' => 'required|string',
            'full_name' => 'required|string',
            'phone_number' => 'required|string',
        ]);

        $opportunity = VolunteerOpportunity::findOrFail($id);

        if ($opportunity->status !== 'open') {
            return response()->json(['message' => 'This opportunity is closed'], 400);
        }

        // Check if already applied
        $existing = VolunteerApplication::where('user_id', Auth::id())
            ->where('opportunity_id', $id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already applied'], 400);
        }

        $application = VolunteerApplication::create([
            'user_id' => Auth::id(),
            'opportunity_id' => $id,
            'full_name' => $request->full_name,
            'phone_number' => $request->phone_number,
            'availability' => $request->availability,
            'skills' => $request->skills,
            'motivation' => $request->motivation,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Application submitted successfully',
            'data' => $application
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'role_type' => 'required|string',
            'location' => 'nullable|string',
            'time_commitment' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'spots_total' => 'required|integer|min:1',
            'image' => 'nullable|image|max:2048',
            'tags' => 'nullable|array'
        ]);

        $team = \App\Models\VolunteerTeam::where('user_id', Auth::id())
            ->where('status', 'approved')
            ->first();

        if (!$team) {
            // Only approved teams can publish directly
            return response()->json(['message' => 'Must be an approved team leader to publish opportunities.'], 403);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('opportunities', 'public');
        }

        $opportunity = VolunteerOpportunity::create([
            'volunteer_team_id' => $team->id,
            'title' => $validated['title'],
            'organization' => $team->name, // Keeping for backward compatibility or display ease
            'description' => $validated['description'],
            'role_type' => $validated['role_type'],
            'location' => $validated['location'],
            'time_commitment' => $validated['time_commitment'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'spots_total' => $validated['spots_total'],
            'image' => $imagePath,
            'tags' => $validated['tags'],
            'status' => 'open',
            'moderation_status' => 'approved' // Trusted teams get auto-approve? Or make it pending? Let's say approved for now to reduce friction
        ]);

        return response()->json($opportunity, 201);
    }
}
