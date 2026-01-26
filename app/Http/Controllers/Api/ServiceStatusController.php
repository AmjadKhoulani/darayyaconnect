<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ServiceStatusController extends Controller
{
    public function getStatus()
    {
        $now = Carbon::now();
        $today = $now->toDateString();
        
        // Calculate Electricity Percentage (Available vs Total logs in last 24h)
        $elecLogs = ServiceLog::where('service_type', 'electricity')
            ->where('created_at', '>=', $now->subHours(24))
            ->get();
            
        $elecTotal = $elecLogs->count();
        $elecAvailable = $elecLogs->where('status', 'available')->count();
        $elecPercent = $elecTotal > 0 ? round(($elecAvailable / $elecTotal) * 100) : 0;

        // Calculate Water Percentage
        $waterLogs = ServiceLog::where('service_type', 'water')
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->get();
            
        $waterTotal = $waterLogs->count();
        $waterAvailable = $waterLogs->where('status', 'available')->count();
        $waterPercent = $waterTotal > 0 ? round(($waterAvailable / $waterTotal) * 100) : 0;

        // Get user's own logs for today
        $userLogs = [];
        if (auth('sanctum')->check()) {
            $userLogs = ServiceLog::where('user_id', auth('sanctum')->id())
                ->where('log_date', $today)
                ->pluck('service_type')
                ->toArray();
        }

        return response()->json([
            'communityStats' => [
                'electricity' => $elecPercent,
                'water' => $waterPercent . '%'
            ],
            'userLogs' => $userLogs
        ]);
    }
}
