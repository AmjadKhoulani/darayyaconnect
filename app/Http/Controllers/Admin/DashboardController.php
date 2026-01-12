<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
// use App\Models\Project;
use App\Models\ServiceAlert;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Compute Bottleneck Stats (Temporarily disabled or mapped to Initiatives)
        // $stalledProjects = Project::whereNotNull('bottleneck_reason')->get(); 
        // $bottlenecksByReason = $stalledProjects->groupBy('bottleneck_reason')->map->count();

        // Calculate Average "Patience Index" (Days Stalled)
        // $avgStallDays = $stalledProjects->avg(function($p) {
        //      return $p->bottleneck_date ? now()->diffInDays($p->bottleneck_date) : 0;
        // });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'reports_pending' => Report::where('status', 'received')->count(),
                'projects_ongoing' => \App\Models\Initiative::where('status', 'active')->count(), // Use Initiative
                'projects_stalled' => 0, // $stalledProjects->count(), 
                'avg_stall_days' => 0, // round($avgStallDays),
                'citizens_count' => User::count(),
                'active_alerts' => ServiceAlert::active()->count(),
            ],
            'bottlenecks' => [
                'summary' => [], // $bottlenecksByReason,
                'list' => []
            ],
            'recent_reports' => Report::latest()->take(5)->get(),
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
