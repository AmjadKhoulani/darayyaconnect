<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
// use App\Models\Project;
use App\Models\ServiceAlert;
use App\Models\User;
use App\Models\ServiceLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Initialize defaults
        $reportTrends = [];
        $userTrends = [];
        $serviceTrends = [];

        try {
            // Fetch Report Trends (Last 7 Days)
            $reportTrends = Report::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('count(*) as count')
                )
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } catch (\Exception $e) {
            \Log::error('Dashboard Report Trends Error: ' . $e->getMessage());
        }

        try {
            // Fetch User Growth (Last 7 Days)
            $userTrends = User::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('count(*) as count')
                )
                ->where('created_at', '>=', now()->subDays(7))
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        } catch (\Exception $e) {
            \Log::error('Dashboard User Trends Error: ' . $e->getMessage());
        }

        try {
            // Fetch Service Availability (Last 7 Days Average)
            $serviceTrends = ServiceLog::select(
                    DB::raw('DATE(log_date) as date'),
                    'service_type',
                    DB::raw('count(*) as total'),
                    DB::raw('sum(case when status = "available" then 1 else 0 end) as available')
                )
                ->where('log_date', '>=', now()->subDays(7))
                ->groupBy('date', 'service_type')
                ->orderBy('date')
                ->get()
                ->groupBy('service_type');
        } catch (\Exception $e) {
             \Log::error('Dashboard Service Trends Error: ' . $e->getMessage());
        }

        // Helper to safely fetch data or return default
        $safeFetch = function($callback, $default = []) {
            try {
                return $callback();
            } catch (\Throwable $e) {
                \Log::error('Dashboard Fetch Error: ' . $e->getMessage());
                return $default;
            }
        };

        // Stats
        $stats = [
            'reports_pending' => $safeFetch(fn() => Report::where('status', 'received')->count(), 0),
            'projects_ongoing' => $safeFetch(fn() => \App\Models\Initiative::where('status', 'active')->count(), 0),
            'projects_stalled' => 0,
            'avg_stall_days' => 0,
            'citizens_count' => $safeFetch(fn() => User::count(), 0),
            'active_alerts' => $safeFetch(fn() => ServiceAlert::active()->count(), 0),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'trends' => [
                'reports' => $reportTrends,
                'users' => $userTrends,
                'services' => $serviceTrends,
            ],
            'bottlenecks' => [
                'summary' => [],
                'list' => []
            ],
            'recent_reports' => $safeFetch(fn() => Report::latest()->take(5)->with('user')->get(), []),
            'active_alerts' => $safeFetch(fn() => ServiceAlert::active()->latest()->get(), []),
            'active_sos_alerts' => $safeFetch(fn() => \App\Models\SosAlert::where('status', 'active')->with('user')->latest()->get(), []),
            'infrastructure_points' => $safeFetch(fn() => \App\Models\InfrastructurePoint::orderBy('type')->orderBy('name')->get(), []),
            'users' => $safeFetch(fn() => User::latest()->take(10)->get(), []),
            'services' => $safeFetch(fn() => \App\Models\Service::all(), []),
            'departments' => $safeFetch(fn() => \App\Models\Department::withCount('users')->get(), []),
        ]);
    }

    public function sendAlert(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'required|in:info,success,warning,danger',
            'duration_hours' => 'required|integer|min:1',
        ]);

        ServiceAlert::create([
            'title' => $request->title,
            'body' => $request->body,
            'type' => $request->type,
            'expires_at' => now()->addHours($request->duration_hours),
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Notification broadcasted successfully!');
    }

    // API endpoint for the public banner
    public function activeAlerts()
    {
        return ServiceAlert::active()->orderByDesc('created_at')->get();
    }

    public function activePoll()
    {
        // Get the latest poll
        $poll = \App\Models\Post::where('type', 'poll')
            ->latest()
            ->first();
            
        if (!$poll) return response()->json(null);

        // Check if user has voted
        $userVote = null;
        if (auth('sanctum')->check()) {
            $userVote = \App\Models\Vote::where('user_id', auth('sanctum')->id())
                ->where('votable_type', \App\Models\Post::class)
                ->where('votable_id', $poll->id)
                ->first();
        }

        return response()->json([
            'id' => $poll->id,
            'title' => $poll->title,
            'content' => $poll->content,
            'metadata' => $poll->metadata,
            'user_vote_id' => $userVote ? $userVote->option_id : null
        ]);
    }

    public function resolveSos(\App\Models\SosAlert $alert)
    {
        $alert->update([
            'status' => 'resolved',
            'resolved_at' => now()
        ]);

        return redirect()->back()->with('success', 'تم إنهاء حالة الاستغاثة بنجاح.');
    }
}
