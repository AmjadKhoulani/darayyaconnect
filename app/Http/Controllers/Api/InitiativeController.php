<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Initiative;
use Illuminate\Http\Request;

class InitiativeController extends Controller
{
    public function index()
    {
        $initiatives = Initiative::where('moderation_status', 'approved')
            ->with('user:id,name')
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
                $file = $request->file('image');
                $path = $file->store('initiatives', 'public');
                // Use relative path for storage to avoid issues with APP_URL
                $imagePath = '/storage/' . $path;
                \Log::info('Image stored', ['path' => $imagePath]);
            } else if (is_string($request->image)) {
                $imagePath = $request->image;
            }

            $user = $request->user();
            if (!$user) {
                \Log::error('Initiative store failed: User not authenticated');
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            $initiative = Initiative::create([
                'user_id' => $user->id,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'image' => $imagePath,
                'status' => 'قيد المراجعة',
                'moderation_status' => 'pending',
                'votes_count' => 0
            ]);

            \Log::info('Initiative created successfully', ['id' => $initiative->id]);

            return response()->json($initiative, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Initiative validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'بيانات غير صالحة',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Initiative store failed', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json(['message' => 'حدث خطأ في الخادم أثناء حفظ المبادرة'], 500);
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
