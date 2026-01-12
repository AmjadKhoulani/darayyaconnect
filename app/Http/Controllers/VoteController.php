<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'votable_type' => ['required', Rule::in(['post', 'project'])],
            'votable_id' => 'required|integer',
            'option_id' => 'nullable|integer', // For poll options
            'value' => 'nullable|integer|between:-1,1', // Upvote/Downvote
        ]);

        // Map short type to full class name
        $modelClass = $validated['votable_type'] === 'post' 
            ? \App\Models\Post::class 
            : \App\Models\Project::class;

        // Ensure user hasn't voted already
        $existingVote = Vote::where('user_id', auth()->id())
            ->where('votable_type', $modelClass)
            ->where('votable_id', $validated['votable_id'])
            ->first();

        if ($existingVote) {
             return response()->json(['message' => 'لقد قمت بالتصويت مسبقاً لهذا العنصر'], 422);
        }

        // Create Vote
        Vote::create([
            'user_id' => auth()->id(),
            'votable_type' => $modelClass,
            'votable_id' => $validated['votable_id'],
            'option_id' => $validated['option_id'] ?? null,
            'value' => $validated['value'] ?? 1,
        ]);

        return response()->json(['message' => 'تم احتساب صوتك بنجاح! 🗳️']);
    }
}
