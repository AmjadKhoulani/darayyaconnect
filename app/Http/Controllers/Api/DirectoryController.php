<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectoryItem;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    public function index(Request $request)
    {
        $query = DirectoryItem::where('is_active', true);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
            'type' => 'required|string|max:50',
            'category' => 'required|string|max:50',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'metadata' => 'nullable|array',
        ]);

        $item = DirectoryItem::create($validated);
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = DirectoryItem::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
            'type' => 'sometimes|string|max:50',
            'category' => 'sometimes|string|max:50',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'metadata' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = DirectoryItem::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
