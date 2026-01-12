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
     * Get the crowdsourced heatmap data.
     * Groups daily reports by neighborhood to determine service status.
     */
    public function getHeatmapData(Request $request)
    {
        $serviceType = $request->query('type', 'electricity'); // 'electricity' or 'water'
        $today = Carbon::today();

        // 1. Aggregate Reports by Neighborhood
        $stats = ServiceLog::where('service_type', $serviceType)
            ->whereDate('log_date', $today)
            ->select('neighborhood', DB::raw('count(*) as total'), DB::raw('sum(case when status = "available" then 1 else 0 end) as available_count'))
            ->groupBy('neighborhood')
            ->having('total', '>=', 1) // Show even with 1 report for now, threshold can be increased
            ->get();

        // 2. Fetch Neighborhood Geometries
        // We assume InfrastructurePoint has entries with type="neighborhood_zone" and name matching the user's neighborhood string
        $neighborhoodNames = $stats->pluck('neighborhood')->toArray();
        $zones = InfrastructurePoint::whereIn('name', $neighborhoodNames)
            ->where('type', 'neighborhood_zone')
            ->get()
            ->keyBy('name');

        // 3. Build GeoJSON
        $features = [];

        foreach ($stats as $stat) {
            $score = ($stat->total > 0) ? ($stat->available_count / $stat->total) * 100 : 0;
            
            // Determine Status
            if ($score >= 60) {
                $status = 'available'; // Green
            } elseif ($score <= 40) {
                $status = 'cutoff';    // Red
            } else {
                $status = 'unstable';  // Amber
            }

            // Find Geometry
            $zone = $zones->get($stat->neighborhood);
            $geometry = null;
            $center = null;

            if ($zone && $zone->geometry) {
                // Use the polygon geometry
                $geometry = $zone->geometry;
                
                // Calculate rough center for the icon point (simplified centroid)
                // Assuming geometry is { type: "Polygon", coordinates: [[[x,y], ...]] }
                if (isset($geometry['coordinates'][0])) {
                    $coords = $geometry['coordinates'][0];
                    $sumLat = 0; $sumLng = 0; $count = count($coords);
                    foreach ($coords as $point) {
                        $sumLng += $point[0];
                        $sumLat += $point[1];
                    }
                    $center = [$sumLng / $count, $sumLat / $count];
                }
            } else {
                // Fallback: If no zone defined, skip or perhaps use an average of user locations (complex query)
                // For now, only show matched neighborhoods
                continue; 
            }

            $features[] = [
                'type' => 'Feature',
                'geometry' => $geometry,
                'properties' => [
                    'neighborhood' => $stat->neighborhood,
                    'total_reports' => $stat->total,
                    'available_count' => $stat->available_count,
                    'score' => round($score, 1),
                    'status' => $status,
                    'service_type' => $serviceType,
                    'center' => $center
                ]
            ];
        }

        return response()->json([
            'type' => 'FeatureCollection',
            'properties' => [
                'generated_at' => now()->toIso8601String(),
                'service_type' => $serviceType
            ],
            'features' => $features
        ]);
    }
}
