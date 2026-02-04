<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\Project;
use Illuminate\Http\Request;

class EngagementController extends Controller
{
    // --- Discussions ---
    public function getDiscussions()
    {
        return response()->json(
            Discussion::where('moderation_status', 'approved')
                ->with('user:id,name')
                ->withCount(['votes', 'replies'])
                ->latest()
                ->get()
        );
    }

    public function showDiscussion($id)
    {
        return response()->json(
            Discussion::with(['user:id,name', 'replies' => function($query) {
                $query->whereNull('parent_id')->with('user:id,name', 'replies.user:id,name');
            }]) 
                ->withCount(['votes', 'replies'])
                ->findOrFail($id)
        );
    }

    public function storeDiscussion(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category' => 'required|string',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('discussions', 'public');
        }

        $discussion = Discussion::create([
            'user_id' => $request->user()->id, 
            'title' => $request->title,
            'body' => $request->body,
            'category' => $request->category,
            'image_path' => $imagePath,
            'moderation_status' => 'pending',
        ]);

        return response()->json($discussion, 201);
    }

    public function storeReply(Request $request, $id)
    {
        $request->validate([
            'body' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'parent_id' => 'nullable|exists:discussion_replies,id',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('replies', 'public');
        }

        $discussion = Discussion::findOrFail($id);

        $body = $request->body;
        $forbiddenWords = \App\Models\ForbiddenWord::pluck('word')->toArray();
        foreach ($forbiddenWords as $word) {
            if (empty($word)) continue;
            $body = preg_replace('/' . preg_quote($word, '/') . '/iu', str_repeat('*', mb_strlen($word)), $body);
        }

        $reply = $discussion->replies()->create([
            'user_id' => $request->user()->id,
            'body' => $body,
            'image_path' => $imagePath,
            'parent_id' => $request->parent_id,
        ]);

        return response()->json($reply->load('user:id,name'), 201);
    }

    public function voteDiscussion(Request $request, $id)
    {
        $discussion = Discussion::findOrFail($id);
        $user = $request->user();

        // Toggle Vote
        $existingVote = $discussion->votes()->where('user_id', $user->id)->first();

        if ($existingVote) {
            $existingVote->delete();
            $status = 'unvoted';
        } else {
            $discussion->votes()->create([
                'user_id' => $user->id,
                'type' => 'up' // Default to support
            ]);
            $status = 'voted';
        }

        return response()->json([
            'status' => $status,
            'votes_count' => $discussion->votes()->count()
        ]);
    }

    // --- City Projects (Priorities) ---
    public function getProjects()
    {
        return response()->json(
            Project::orderBy('score', 'desc')->get()
        );
    }

    public function voteProject(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $project->increment('votes_count');
        return response()->json(['message' => 'Voted successfully', 'votes' => $project->votes_count]);
    }

    // --- Polls ---
    public function votePoll(Request $request, $id)
    {
        $request->validate(['option_id' => 'required']);
        
        // Remove previous vote for this poll
        \App\Models\Vote::where('user_id', $request->user()->id)
            ->where('votable_type', \App\Models\Post::class)
            ->where('votable_id', $id)
            ->delete();

        // Add new vote
        \App\Models\Vote::create([
            'user_id' => $request->user()->id,
            'votable_type' => \App\Models\Post::class,
            'votable_id' => $id,
            'option_id' => $request->option_id,
            'type' => 'poll_option'
        ]);

        return response()->json(['message' => 'Voted successfully']);
    }
}
