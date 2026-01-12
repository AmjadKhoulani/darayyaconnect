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
