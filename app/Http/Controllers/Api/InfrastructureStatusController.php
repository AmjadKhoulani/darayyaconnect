<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceLog;
use App\Models\InfrastructurePoint;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class InfrastructureStatusController extends Controller
{
    /**
     * Get the crowdsourced heatmap data (Dynamic Spatial Clustering).
     * Groups users into 100m blocks (approx 0.001 deg) to form "Population Blocks".
     * If a block has enough reports (>= 2 for testing, 10 for prod), it shows status.
     */
    public function getHeatmapData(Request $request)
    {
        $serviceType = $request->query('type', 'electricity'); // 'electricity' or 'water'
        $date = $request->query('date') ? Carbon::parse($request->query('date')) : Carbon::today();

        // 1. Identify Population Blocks
        // Group verified residents by spatial grid (3 decimal places ~= 111m)
        $blocks = \App\Models\User::where('is_resident', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select(
                DB::raw('ROUND(latitude, 3) as lat_block'),
                DB::raw('ROUND(longitude, 3) as lng_block'),
                DB::raw('count(*) as population')
            )
            ->groupBy('lat_block', 'lng_block')
            ->having('population', '>=', 2) // Threshold: 10 houses (set to 2 for testing)
            ->get();

        $features = [];

        foreach ($blocks as $block) {
            // center of the block
            $lat = $block->lat_block;
            $lng = $block->lng_block;

            // 2. Get Reports within this spatial block for today
            // We search for logs from users whose location rounds to this block
            // Note: Ideally ServiceLog should snapshot the user's location at time of report, 
            // but for now we join with User table or assume User location is static home.
            // A more robust way: ServiceLog should store lat/lng. 
            // Assuming ServiceLog has user_id, let's query logs where user is in this block.
            
            $reportStats = DB::table('service_logs')
                ->join('users', 'service_logs.user_id', '=', 'users.id')
                ->where('service_logs.service_type', $serviceType)
                ->whereDate('service_logs.log_date', $date)
                ->whereRaw('ROUND(users.latitude, 3) = ?', [$lat])
                ->whereRaw('ROUND(users.longitude, 3) = ?', [$lng])
                ->select(
                    DB::raw('count(*) as total_reports'),
                    DB::raw('sum(case when service_logs.status = "available" then 1 else 0 end) as available_count')
                )
                ->first();

            $totalReports = $reportStats->total_reports ?? 0;
            $availableCount = $reportStats->available_count ?? 0;

            // Default status is "stable" (no news is good news?) or "unknown".
            // If we have reports, we calculate score.
            $status = 'unknown';
            $score = 0;

            if ($totalReports > 0) {
                $score = ($availableCount / $totalReports) * 100;
                if ($score >= 60) {
                    $status = 'available'; // Green
                } elseif ($score <= 40) {
                    $status = 'cutoff';    // Red
                } else {
                    $status = 'unstable';  // Amber
                }
            } else {
                // No reports today. 
                // Strategy: If it's a population block, maybe assume available? 
                // User requirement: "When they report no electricity, it shows sign".
                // So default is nothing/invisible or 'available'.
                // Let's only return features if there are reports OR if we want to show population density heat (heatmap layer handles density).
                // User specifically wants "Cutoff Signs". So we only care if status is cutoff/unstable.
                continue; 
            }

            $features[] = [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [(float)$lng, (float)$lat]
                ],
                'properties' => [
                    'lat_block' => $lat,
                    'lng_block' => $lng,
                    'population' => $block->population,
                    'total_reports' => $totalReports,
                    'score' => round($score, 1),
                    'status' => $status,
                    'service_type' => $serviceType
                ]
            ];
        }

        return response()->json([
            'type' => 'FeatureCollection',
            'properties' => [
                'generated_at' => now()->toIso8601String(),
                'service_type' => $serviceType,
                'threshold' => 2 // 10
            ],
            'features' => $features
        ]);
    }

    public function getSummary(Request $request)
    {
        $officialStates = \App\Models\ServiceState::where('is_active', true)->get();
        
        $summary = $officialStates->map(function ($state) {
            return [
                'id' => $state->service_key,
                'name' => $state->name,
                'icon' => $state->icon,
                'status' => $state->status_color === 'emerald' ? 'stable' : ($state->status_color === 'red' ? 'cutoff' : 'unstable'),
                'label' => $state->status_text,
                'updated_at' => $state->last_updated_at ? $state->last_updated_at->toIso8601String() : $state->updated_at->toIso8601String()
            ];
        });

        return response()->json($summary);
    }
}
