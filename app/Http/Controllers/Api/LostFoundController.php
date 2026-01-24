<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostFoundItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LostFoundController extends Controller
{
    public function index(Request $request)
    {
        $query = LostFoundItem::where('moderation_status', 'approved')->with('user:id,name')->active();

        // Filter by type
        if ($request->has('type') && in_array($request->type, ['lost', 'found'])) {
            $query->where('type', $request->type);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->category($request->category);
        }

        // Filter by location
        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort by newest first
        $items = $query->latest()->paginate(20);

        return response()->json($items);
    }

    public function show($id)
    {
        $item = LostFoundItem::with('user:id,name,phone,email')->findOrFail($id);
        
        return response()->json($item);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:lost,found',
            'category' => 'required|in:documents,phone,keys,bag,wallet,jewelry,pet,other',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'date' => 'required|date',
            'images' => 'nullable|array',
            'images.*' => 'nullable|string',
            'contact_info' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['status'] = 'active';
        $validated['moderation_status'] = 'approved';

        $item = LostFoundItem::create($validated);

        return response()->json([
            'message' => 'تم إضافة الإعلان بنجاح',
            'item' => $item
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $item = LostFoundItem::findOrFail($id);

        // Check if user owns this item
        if ($item->user_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string',
            'images' => 'nullable|array',
            'contact_info' => 'nullable|string',
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'تم تحديث الإعلان',
            'item' => $item
        ]);
    }

    public function resolve($id)
    {
        $item = LostFoundItem::findOrFail($id);

        // Check if user owns this item
        if ($item->user_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $item->update(['status' => 'resolved']);

        return response()->json([
            'message' => 'تم وضع علامة على الإعلان كـ "تم الحل"',
            'item' => $item
        ]);
    }

    public function destroy($id)
    {
        $item = LostFoundItem::findOrFail($id);

        // Check if user owns this item
        if ($item->user_id !== Auth::id()) {
            return response()->json(['message' => 'غير مصرح'], 403);
        }

        $item->delete();

        return response()->json(['message' => 'تم حذف الإعلان بنجاح']);
    }

    public function stats()
    {
        $stats = [
            'total' => LostFoundItem::active()->count(),
            'lost' => LostFoundItem::active()->lost()->count(),
            'found' => LostFoundItem::active()->found()->count(),
            'resolved_this_month' => LostFoundItem::where('status', 'resolved')
                ->whereMonth('updated_at', now()->month)
                ->count(),
        ];

        return response()->json($stats);
    }
}
