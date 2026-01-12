<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Poll;
use App\Models\PollVote;
use App\Models\PollOption;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PollController extends Controller
{
    public function vote(Request $request, Poll $poll)
    {
        $user = Auth::user();

        $request->validate([
            'option_id' => 'required|exists:poll_options,id'
        ]);
        
        // Prevent generic users from voting if validation needed? 
        // For now, anyone registered can vote.

        // Check double vote
        $existing = PollVote::where('user_id', $user->id)
            ->where('poll_id', $poll->id)
            ->first();

        if ($existing) {
            return back()->with('error', 'You have already voted in this poll.');
        }

        // Cast Vote
        PollVote::create([
            'user_id' => $user->id,
            'poll_id' => $poll->id,
            'poll_option_id' => $request->option_id
        ]);

        // Increment Counter (Optimization)
        PollOption::where('id', $request->option_id)->increment('votes_count');

        return back()->with('success', 'Vote cast successfully!');
    }
}
