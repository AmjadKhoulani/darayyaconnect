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
}
