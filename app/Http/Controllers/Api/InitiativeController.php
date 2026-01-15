<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Initiative;
use Illuminate\Http\Request;

class InitiativeController extends Controller
{
    public function index()
    {
        $initiatives = Initiative::with('user:id,name')
            ->latest()
            ->get()
            ->map(function ($initiative) {
                return [
                    'id' => $initiative->id,
                    'title' => $initiative->title,
                    'description' => $initiative->description,
                    'status' => $initiative->status,
                    'image' => $initiative->image,
                    'votes_count' => $initiative->votes_count ?? 0,
                    'created_at' => $initiative->created_at->diffForHumans()
                ];
            });

        return response()->json($initiatives);
    }

    public function store(Request $request)
    {
        \Log::info('Initiative store attempt', [
            'user' => $request->user()?->id,
            'data' => $request->except('image'),
            'has_file' => $request->hasFile('image')
        ]);

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'nullable', 
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('initiatives', 'public');
                $imagePath = asset('storage/' . $path);
                \Log::info('Image stored', ['path' => $imagePath]);
            } else if (is_string($request->image)) {
                $imagePath = $request->image;
            }

            $initiative = Initiative::create([
                'user_id' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'image' => $imagePath,
                'status' => 'قيد المراجعة',
                'votes_count' => 0
            ]);

            \Log::info('Initiative created', ['id' => $initiative->id]);

            return response()->json($initiative, 201);
        } catch (\Exception $e) {
            \Log::error('Initiative store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $initiative = Initiative::with('user:id,name')->findOrFail($id);
        
        return response()->json([
            'id' => $initiative->id,
            'title' => $initiative->title,
            'description' => $initiative->description,
            'status' => $initiative->status,
            'image' => $initiative->image,
            'votes_count' => $initiative->votes_count ?? 0,
            'created_at' => $initiative->created_at->diffForHumans(),
            'user' => $initiative->user
        ]);
    }

    public function vote(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $initiative = Initiative::findOrFail($id);
        
        // Check if user already voted
        $hasVoted = $initiative->votes()->where('user_id', $user->id)->exists();
        
        if ($hasVoted) {
            return response()->json(['message' => 'Already voted'], 400);
        }

        $initiative->votes()->create(['user_id' => $user->id]);
        $initiative->increment('votes_count');
        
        return response()->json(['message' => 'Vote recorded', 'votes_count' => $initiative->votes_count]);
    }
}
