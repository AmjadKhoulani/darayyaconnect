<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\ServiceLog;
use App\Models\Poll;
use App\Models\PollVote;
use Carbon\Carbon;

class UserDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Redirect Officials
        if ($user->role === 'official') {
            return redirect()->route('official.dashboard');
        }

        // Redirect Admin (NEW)
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        // Redirect Institutions
        if ($user->role === 'institution') {
            return redirect()->route('institution.dashboard');
        }


        // Enforce Onboarding
        if (!$user->latitude || !$user->longitude) {
            return redirect()->route('onboarding.location');
        }

        $userId = $user->id;
        $today = Carbon::today()->toDateString();

        // Check if user logged today
        $userLogs = ServiceLog::where('user_id', $userId)
            ->whereDate('log_date', $today)
            ->pluck('service_type')
            ->toArray();

        // Community Stats (Average hours today)
        $communityStats = [
            'electricity' => ServiceLog::where('service_type', 'electricity')
                ->whereDate('log_date', $today)
                ->avg('duration_hours') ?? 0,
            'water' => ServiceLog::where('service_type', 'water')
                ->whereDate('log_date', $today)
                ->where('status', 'available')
                ->count() > 0 ? 'Water Came' : 'No Water', // Simplified for water
        ];

        // Active Poll (Get the latest active one)
        $activePoll = Poll::where('status', 'active')
            ->where('expires_at', '>', now())
            ->with(['options', 'department'])
            ->latest()
            ->first();

        // Check if user voted in this poll
        if ($activePoll) {
            $activePoll->user_voted = PollVote::where('poll_id', $activePoll->id)
                ->where('user_id', $userId)
                ->exists();
        }

        // Upcoming Events
        $upcomingEvents = \App\Models\Event::where('start_time', '>', now())
            ->withCount('attendees')
            ->orderBy('start_time', 'asc')
            ->take(3)
            ->get()
            ->each(function ($event) {
                $event->append('is_attending');
            });

        // [SYNC] Fetch Additional Data for Mobile Parity
        $population = \App\Models\User::count(); // Use simple count for now or filter by role if needed
        
        $recentNews = \App\Models\News::with('user:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'excerpt' => $item->excerpt ?? substr($item->content, 0, 100) . '...',
                    'author' => $item->user->name ?? 'مجلس المدينة',
                    'created_at' => $item->created_at->diffForHumans(),
                    'category' => $item->category ?? 'news'
                ];
            });

        $serviceStates = \App\Models\ServiceState::where('is_active', true)->get();

        return Inertia::render('Dashboard', [
            'userLogs' => $userLogs, // ['electricity', 'water'] if logged
            'communityStats' => $communityStats,
            'notifications' => $user->unreadNotifications,
            'auth' => [
                'user' => $user
            ],
            'active_poll' => $activePoll,
            'upcoming_events' => $upcomingEvents,
            // [SYNC] New Props
            'population' => $population,
            'news' => $recentNews,
            'serviceStates' => $serviceStates,
            'pharmacy_status' => $user->profession === 'pharmacist' 
                ? DB::table('directory_contacts')->where('user_id', $user->id)->value('status') 
                : null
        ]);
    }
}
