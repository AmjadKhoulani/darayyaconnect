<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VolunteerOpportunity;
use App\Models\VolunteerApplication;

class VolunteeringController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Volunteer/Index', [
            'opportunities' => VolunteerOpportunity::withCount('applications')->orderBy('created_at', 'desc')->get(),
            'applications' => VolunteerApplication::with(['user', 'opportunity'])->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'spots_total' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image' => 'nullable|url',
            'status' => 'required|in:open,closed',
            'role_type' => 'required|string', // field, administrative, etc.
            'tags' => 'nullable|array' // array of strings
        ]);

        VolunteerOpportunity::create($validated);

        return redirect()->back()->with('success', 'تم إنشاء الفرصة بنجاح');
    }

    public function update(Request $request, $id)
    {
        $opportunity = VolunteerOpportunity::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'spots_total' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'image' => 'nullable|url',
            'status' => 'required|in:open,closed',
            'role_type' => 'required|string',
            'tags' => 'nullable|array'
        ]);

        $opportunity->update($validated);

        return redirect()->back()->with('success', 'تم تحديث الفرصة بنجاح');
    }

    public function destroy($id)
    {
        VolunteerOpportunity::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'تم حذف الفرصة');
    }

    // Application Status Updates
    public function updateApplicationStatus(Request $request, $id)
    {
        $application = VolunteerApplication::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $application->update(['status' => $request->status]);

        // If approved, increment the filled spots
        if ($request->status === 'approved') {
            $opportunity = $application->opportunity;
            if ($opportunity) {
                $opportunity->increment('spots_filled');
            }
        }

        return redirect()->back()->with('success', 'تم تحديث حالة الطلب');
    }
}
