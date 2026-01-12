<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\EventAttendee;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    // Toggle attendance
    public function attend(Request $request, Event $event)
    {
        $user = Auth::user();
        
        $attendance = EventAttendee::where('user_id', $user->id)
            ->where('event_id', $event->id)
            ->first();
            
        if ($attendance) {
            // Toggle off
            $attendance->delete();
            return back()->with('success', 'Removed from event.');
        } else {
            // Toggle on
            EventAttendee::create([
                'user_id' => $user->id,
                'event_id' => $event->id,
                'status' => 'going'
            ]);
            return back()->with('success', 'You are going to this event!');
        }
    }
}
