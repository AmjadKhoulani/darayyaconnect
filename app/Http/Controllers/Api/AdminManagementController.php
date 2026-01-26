<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VolunteerOpportunity;
use App\Models\VolunteerApplication;
use App\Models\AiStudy;
use App\Models\Generator;
use App\Models\DirectoryItem;
use App\Models\Department;
use App\Models\ServiceAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminManagementController extends Controller
{
    // --- Volunteering ---
    public function volunteerIndex()
    {
        return response()->json([
            'opportunities' => VolunteerOpportunity::withCount('applications')->latest()->get(),
            'applications' => VolunteerApplication::with(['user', 'opportunity'])->latest()->get()
        ]);
    }

    public function volunteerStore(Request $request)
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
            'role_type' => 'required|string',
            'tags' => 'nullable|array'
        ]);

        $opportunity = VolunteerOpportunity::create($validated);
        return response()->json($opportunity);
    }

    public function volunteerUpdate(Request $request, $id)
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
        return response()->json($opportunity);
    }

    public function volunteerDestroy($id)
    {
        VolunteerOpportunity::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function updateVolunteerApplicationStatus(Request $request, $id)
    {
        $application = VolunteerApplication::findOrFail($id);
        $request->validate(['status' => 'required|in:pending,approved,rejected']);

        if ($request->status === 'approved' && $application->status !== 'approved') {
            $opportunity = $application->opportunity;
            if ($opportunity) $opportunity->increment('spots_filled');
        }

        $application->update(['status' => $request->status]);
        return response()->json(['success' => true]);
    }

    // --- AI Studies ---
    public function aiStudyIndex()
    {
        return response()->json(AiStudy::orderBy('display_order')->get());
    }

    public function aiStudyStore(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:10',
            'category' => 'required|string|max:50',
            'color' => 'required|string|max:20',
            'gradient' => 'required|string|max:100',
            'summary' => 'required|string',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'scenario' => 'required|array',
            'economics' => 'required|array',
            'environmental' => 'nullable|array',
            'social' => 'required|array',
            'implementation' => 'required|array',
            'risks' => 'nullable|array',
            'recommendations' => 'nullable|array',
            'technical_details' => 'nullable|array',
        ]);

        $study = AiStudy::create($validated);
        return response()->json($study);
    }

    public function aiStudyUpdate(Request $request, $id)
    {
        $study = AiStudy::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:10',
            'category' => 'required|string|max:50',
            'color' => 'required|string|max:20',
            'gradient' => 'required|string|max:100',
            'summary' => 'required|string',
            'summary' => 'required|string',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'scenario' => 'required|array',
            'economics' => 'required|array',
            'environmental' => 'nullable|array',
            'social' => 'required|array',
            'implementation' => 'required|array',
            'risks' => 'nullable|array',
            'recommendations' => 'nullable|array',
            'technical_details' => 'nullable|array',
        ]);

        $study->update($validated);
        return response()->json($study);
    }

    public function aiStudyDestroy($id)
    {
        AiStudy::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Generators ---
    public function generatorIndex()
    {
        return response()->json(Generator::latest()->get());
    }

    public function generatorStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'ampere_price' => 'required|numeric',
            'status' => 'required|in:active,down,maintenance',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);
        $validated['user_id'] = auth()->id();
        $generator = Generator::create($validated);
        return response()->json($generator);
    }

    public function generatorUpdate(Request $request, $id)
    {
        $generator = Generator::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'ampere_price' => 'required|numeric',
            'status' => 'required|in:active,down,maintenance',
        ]);
        $generator->update($validated);
        return response()->json($generator);
    }

    public function generatorDestroy($id)
    {
        Generator::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Directory ---
    public function directoryIndex()
    {
        return response()->json(DirectoryItem::orderBy('name')->get());
    }

    public function directoryStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'type' => 'required|string|max:50',
            'category' => 'required|string|in:official,company,emergency,health',
            'icon' => 'nullable|string',
        ]);
        $item = DirectoryItem::create($validated);
        return response()->json($item);
    }

    public function directoryUpdate(Request $request, $id)
    {
        $item = DirectoryItem::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'type' => 'required|string|max:50',
            'category' => 'required|string|in:official,company,emergency,health',
            'icon' => 'nullable|string',
        ]);
        $item->update($validated);
        return response()->json($item);
    }

    public function directoryDestroy($id)
    {
        DirectoryItem::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Departments ---
    public function departmentIndex()
    {
        return response()->json(Department::withCount('users')->get());
    }

    public function departmentStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
        ]);
        $dept = Department::create($validated);
        return response()->json($dept);
    }

    public function departmentUpdate(Request $request, $id)
    {
        $dept = Department::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
        ]);
        $dept->update($validated);
        return response()->json($dept);
    }

    public function departmentDestroy($id)
    {
        Department::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Alerts ---
    public function sendAlert(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'required|in:info,success,warning,danger',
            'duration_hours' => 'required|integer|min:1',
        ]);

        $alert = ServiceAlert::create([
            'title' => $request->title,
            'body' => $request->body,
            'type' => $request->type,
            'expires_at' => now()->addHours($request->duration_hours),
            'is_active' => true,
        ]);

        return response()->json($alert);
    }
}
