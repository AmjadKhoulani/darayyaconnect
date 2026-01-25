<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Initiative;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class InitiativeController extends Controller
{
    public function publicIndex()
    {
        $initiatives = Initiative::where('status', 'active')
            ->latest()
            ->paginate(12);

        return Inertia::render('Initiatives/PublicIndex', [
            'initiatives' => $initiatives
        ]);
    }

    public function index(Request $request)
    {
        $initiatives = Initiative::query()
            ->with('user')
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Initiatives/Index', [
            'initiatives' => $initiatives,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string',
            'status' => 'required|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|image|max:10240', // 10MB Max
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('initiatives', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        Initiative::create($validated);

        return redirect()->back()->with('message', 'تم إضافة المبادرة بنجاح');
    }

    public function update(Request $request, Initiative $initiative)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string',
            'status' => 'required|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists (optional, good practice)
            // if ($initiative->image) Storage::disk('public')->delete(str_replace('/storage/', '', $initiative->image));
            
            $path = $request->file('image')->store('initiatives', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $initiative->update($validated);

        return redirect()->back()->with('message', 'تم تحديث المبادرة');
    }

    public function destroy(Initiative $initiative)
    {
        $initiative->delete();
        return redirect()->back()->with('message', 'تم حذف المبادرة');
    }

    public function approve(Initiative $initiative)
    {
        $initiative->update([
            'moderation_status' => 'approved',
            'status' => 'active',
            'rejection_reason' => null
        ]);
        return redirect()->back()->with('message', 'تم الموافقة على المبادرة ونشرها');
    }

    public function reject(Request $request, Initiative $initiative)
    {
        $request->validate(['reason' => 'required|string']);
        $initiative->update([
            'moderation_status' => 'rejected',
            'status' => 'inactive',
            'rejection_reason' => $request->reason
        ]);
        return redirect()->back()->with('message', 'تم رفض المبادرة وإبلاغ المعلن');
    }
}
