<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Poll;
use App\Models\PollOption;
use Illuminate\Support\Facades\Auth;

class OfficialPollController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'official' || !$user->department_id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'options' => 'required|array|min:2',
            'options.*' => 'required|string|max:255',
            'duration' => 'required|integer|min:1|max:30' // Days
        ]);

        $poll = Poll::create([
            'title' => $request->title,
            'description' => $request->description,
            'department_id' => $user->department_id,
            'status' => 'active',
            'expires_at' => now()->addDays($request->duration)
        ]);

        foreach ($request->options as $optionLabel) {
            PollOption::create([
                'poll_id' => $poll->id,
                'label' => $optionLabel
            ]);
        }

        return back()->with('success', 'Poll created successfully!');
    }
}
