<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LostFoundItem; // Ensure this model exists or use DB
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class LostFoundController extends Controller
{
    public function index(Request $request)
    {
        // Check if model exists, if not created yet, we might need to create it or use DB facade temporarily
        // Assuming LostFoundItem model exists from previous steps (migration was seen)
        
        $items = \App\Models\LostFoundItem::query()
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/LostFound/Index', [
            'items' => $items,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:lost,found',
            'category' => 'required|in:documents,phone,keys,bag,wallet,jewelry,pet,other',
            'location' => 'nullable|string',
            'contact_phone' => 'required|string',
            'image' => 'nullable|image|max:10240',
            'status' => 'required|in:active,resolved',
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('lost-found', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        \App\Models\LostFoundItem::create($validated);

        return redirect()->back()->with('message', 'تم إضافة العنصر بنجاح');
    }

    public function update(Request $request, $id)
    {
        $item = \App\Models\LostFoundItem::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:lost,found',
            'category' => 'required|in:documents,phone,keys,bag,wallet,jewelry,pet,other',
            'location' => 'nullable|string',
            'contact_phone' => 'required|string',
            'image' => 'nullable|image|max:10240',
            'status' => 'required|in:active,resolved',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('lost-found', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $item->update($validated);

        return redirect()->back()->with('message', 'تم تحديث العنصر');
    }

    public function destroy($id)
    {
        \App\Models\LostFoundItem::findOrFail($id)->delete();
        return redirect()->back()->with('message', 'تم حذف العنصر');
    }
}
