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
        // Fetch Report Trends (Last 7 Days)
        $reportTrends = Report::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Fetch User Growth (Last 7 Days)
        $userTrends = User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

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

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'reports_pending' => Report::where('status', 'received')->count(),
                'projects_ongoing' => \App\Models\Initiative::where('status', 'active')->count(),
                'projects_stalled' => 0,
                'avg_stall_days' => 0,
                'citizens_count' => User::count(),
                'active_alerts' => ServiceAlert::active()->count(),
            ],
            'trends' => [
                'reports' => $reportTrends,
                'users' => $userTrends,
                'services' => $serviceTrends,
            ],
            'bottlenecks' => [
                'summary' => [],
                'list' => []
            ],
            'recent_reports' => Report::latest()->take(5)->with('user')->get(),
            'active_alerts' => ServiceAlert::active()->latest()->get(),
            'infrastructure_points' => \App\Models\InfrastructurePoint::orderBy('type')->orderBy('name')->get(),
            'users' => User::latest()->take(10)->get(),
            'services' => \App\Models\Service::all(),
            'departments' => \App\Models\Department::withCount('users')->get(),
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
}
