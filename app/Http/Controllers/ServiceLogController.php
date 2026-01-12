<?php

namespace App\Http\Controllers;

use App\Models\ServiceLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ServiceLogController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'service_type' => 'required|in:electricity,water',
            'status' => 'required|in:available,cut_off',
            'arrival_time' => 'nullable|date_format:H:i',
            'departure_time' => 'nullable|date_format:H:i|after:arrival_time', // Simple validation, handled logic below
            'quality' => 'nullable|string',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if already logged today
        $existing = ServiceLog::where('user_id', Auth::id())
            ->where('service_type', $request->service_type)
            ->where('log_date', Carbon::today())
            ->first();

        if ($existing) {
            return back()->with('error', 'لقد قمت بتسجيل حالة هذه الخدمة لهذا اليوم مسبقاً.');
        }

        // Calculate Duration
        $duration = 0;
        if ($request->arrival_time && $request->departure_time) {
            $start = Carbon::createFromFormat('H:i', $request->arrival_time);
            $end = Carbon::createFromFormat('H:i', $request->departure_time);
            
            // Handle cross-day (e.g. 23:00 to 01:00) - though validation 'after' prevents this simple case,
            // for daily logs we usually log same day.
            if ($end->lessThan($start)) {
                $end->addDay();
            }
            
            $duration = $start->diffInMinutes($end) / 60;
        }

        ServiceLog::create([
            'user_id' => Auth::id(),
            'service_type' => $request->service_type,
            'log_date' => Carbon::today(),
            'status' => $request->status,
            'arrival_time' => $request->arrival_time,
            'departure_time' => $request->departure_time,
            'duration_hours' => $duration > 0 ? $duration : null,
            'quality' => $request->quality,
            'notes' => $request->notes,
            'neighborhood' => Auth::user()->neighborhood ?? 'Unknown'
        ]);

        return back()->with('success', 'شكراً لمساهمتك! تم تسجيل البيانات بنجاح.');
    }
}
