<?php

namespace App\Http\Controllers;

use App\Models\VolunteerOpportunity;
use App\Models\VolunteerApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class VolunteerController extends Controller
{
    public function index()
    {
        $opportunities = VolunteerOpportunity::where('status', 'open')->latest()->get();
        
        // Check if user has applied to any
        $userApplications = [];
        if (Auth::check()) {
            $userApplications = VolunteerApplication::where('user_id', Auth::id())
                ->pluck('opportunity_id')
                ->toArray();
        }

        // Return the PUBLIC/USER view (currently in Volunteer/Index.tsx)
        return Inertia::render('Volunteer/Index', [
            'opportunities' => $opportunities,
            'userApplications' => $userApplications,
        ]);
    }

    public function adminIndex()
    {
        // Return the ADMIN view
        $applications = VolunteerApplication::with('user')->latest()->get();
        return Inertia::render('Admin/Volunteer/Index', [
            'applications' => $applications
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'opportunity_id' => 'required|exists:volunteer_opportunities,id',
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'availability' => 'required|string',
            'skills' => 'nullable|string',
            'motivation' => 'required|string',
        ]);

        VolunteerApplication::create([
            'user_id' => Auth::id(),
            'opportunity_id' => $request->opportunity_id,
            'full_name' => $request->full_name,
            'phone_number' => $request->phone_number,
            'availability' => $request->availability,
            'skills' => $request->skills,
            'motivation' => $request->motivation,
            'status' => 'pending'
        ]);

        return redirect()->back()->with('success', 'تم استلام طلبك بنجاح! سنتواصل معك قريباً.');
    }
}
