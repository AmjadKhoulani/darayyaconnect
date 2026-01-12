<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\ServiceLog;
use App\Models\Report;
use Carbon\Carbon;

class OfficialDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role !== 'official' || !$user->department_id) {
            return redirect()->route('dashboard'); // Redirect citizens back
        }

        // Fetch Department Name
        $deptId = $user->department_id;
        
        // 1. Recent Incoming Reports (From Auto-Routing)
        $reports = Report::where('department_id', $deptId)
            ->where('department_assigned', true)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        // 2. Service Logs (Crowdsourced Data for this utility)
        // E.g. If Water Dept, get 'water' logs.
        // We use the department_id on ServiceLog (added in previous session)
        $serviceLogs = ServiceLog::where('department_id', $deptId)
            ->with(['user', 'user.department'])
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();

        // 3. Stats
        $pendingCount = Report::where('department_id', $deptId)->where('status', 'pending')->count();
        $resolvedCount = Report::where('department_id', $deptId)->where('status', 'resolved')->count();

        // 4. Managed Services (Global Status)
        $services = \Illuminate\Support\Facades\DB::table('services')->get();

        return Inertia::render('Official/Dashboard', [
            'official' => $user,
            'reports' => $reports,
            'service_logs' => $serviceLogs,
            'managed_services' => $services,
            'stats' => [
                'pending' => $pendingCount,
                'resolved' => $resolvedCount,
                'today_logs' => ServiceLog::where('department_id', $deptId)->whereDate('created_at', Carbon::today())->count()
            ]
        ]);
    }
    
    public function updateReportStatus(Request $request, Report $report)
    {
         $request->validate([
             'status' => 'required|in:pending,in_progress,resolved',
             'note' => 'nullable|string'
         ]);
         
         // Verify ownership
         if(Auth::user()->department_id !== $report->department_id) {
             abort(403);
         }
         
         $report->status = $request->status;
         // In a real app, we'd add an "official_note" column or activity log
         $report->save();
         
         return back();
    }

    public function updateServiceStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:services,id',
            'status' => 'required|string',
            'details' => 'nullable|string'
        ]);

        \Illuminate\Support\Facades\DB::table('services')
            ->where('id', $request->id)
            ->update([
                'status' => $request->status,
                'details' => $request->details,
                'updated_at' => now()
            ]);

        return back()->with('success', 'Service updated.');
    }
}
