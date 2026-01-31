<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function heatmap(Request $request)
    {
        $type = $request->query('type', 'problems');

        if ($type === 'community') {
            // "Community Availability": Show where people are
            $users = \App\Models\User::whereNotNull('latitude')->whereNotNull('longitude')->get();

            $features = $users->map(function ($user) {
                return [
                    'type' => 'Feature',
                    'geometry' => [
                        'type' => 'Point',
            'coordinates' => [(float)$user->longitude, (float)$user->latitude],
                    ],
                    'properties' => [
                        'weight' => 1.0, // Each user counts as 1
                    ],
                ];
            });

        } elseif ($type === 'coverage') {
            // "Service Influence Map": Show where we ARE providing value
            // Weight: Schools/Hospitals = 1.0, Parks = 0.8, Lighting = 0.5
            $assets = \App\Models\InfrastructurePoint::where('status', 'active')->get();

            $features = $assets->map(function ($asset) {
                $weight = match ($asset->type) {
                    'public_building', 'health_center', 'school' => 1.0,
                    'park' => 0.8,
                    'lighting', 'water_point' => 0.5,
                    default => 0.3,
                };

                return [
                    'type' => 'Feature',
                    'geometry' => [
                        'type' => 'Point',
                        'coordinates' => [$asset->longitude, $asset->latitude],
                    ],
                    'properties' => [
                        'weight' => $weight,
                    ],
                ];
            });

        } else {
            // "Problem Heatmap": Show trouble spots
            $hoursAgo = $request->query('hours_ago', 24); // Default to last 24h
            
            // Fetch valid reports (new or verified) within time range
            $query = Report::whereIn('status', ['pending', 'verified', 'in_progress']);
            
            if ($hoursAgo < 720) { // If less than a month, apply filter. Otherwise show all history.
                 $query->where('created_at', '>=', now()->subHours($hoursAgo));
            }
            
            $reports = $query->get();

            $features = $reports->map(function ($report) {
                // Calculate weight based on category
                $weight = match ($report->category) {
                    'water', 'electricity', 'infrastructure' => 1.0,
                    'sewage', 'road', 'sanitation' => 0.7,
                    default => 0.3,
                };

                return [
                    'type' => 'Feature',
                    'geometry' => [
                        'type' => 'Point',
                        'coordinates' => [$report->longitude, $report->latitude],
                    ],
                    'properties' => [
                        'weight' => $weight,
                        'category' => $report->category,
                    ],
                ];
            });
        }

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }

    public function pulse()
    {
        // Get neighborhoods that have "Available" logs in the last hour
        // We only care about Electricity for the "Pulse" usually, or we can accept a query param
        $activeNeighborhoods = \App\Models\ServiceLog::where('status', 'available')
            ->where('created_at', '>=', \Carbon\Carbon::now()->subMinutes(60))
            ->pluck('neighborhood')
            ->unique()
            ->values();

        return response()->json([
            'active_neighborhoods' => $activeNeighborhoods
        ]);
    }
}
