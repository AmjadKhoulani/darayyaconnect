<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InfrastructurePoint;
use Illuminate\Http\Request;

class VectorLayerController extends Controller
{
    public function index()
    {
        // Fetch items that have geometry
        $items = InfrastructurePoint::whereNotNull('geometry')->get();

        $features = $items->map(function ($item) {
            // Dynamic Linking: Check if there's an active project for this asset
            // In a real app, this would be a polymorph relationship. For Pilot, we match based on context.
            $projectId = null;
            if ($item->name === 'شارع الثورة' && $item->condition === 'poor') {
                $project = \App\Models\Project::where('title', 'like', '%شارع الثورة%')->first();
                $projectId = $project?->id;
            }

            $props = [
                'id' => $item->id,
                'name' => $item->name,
                'type' => $item->type,
                'status' => $item->status,
                'height' => (float)$item->height, 
                'color' => $this->getColor($item->condition, $item->type),
                'category' => $item->category,
                'project_id' => $projectId // New field for Frontend
            ];
            
            return [
                'type' => 'Feature',
                'geometry' => $item->geometry,
                'properties' => $props
            ];
        });

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features
        ]);
    }

    private function getColor($condition, $type)
    {
        if ($type === 'road') {
            return $condition === 'poor' ? '#f43f5e' : '#10b981'; // Rose-500 (Bad), Emerald-500 (Good)
        }
        
        // Buildings (Premium Palette)
        return match ($condition) {
            'good' => '#3b82f6', // Blue-500
            'fair' => '#f59e0b', // Amber-500
            // "Critical" buildings get the high-contrast "Red" from the reference image
            'poor', 'critical' => '#e11d48', // Rose-600
            // Default buildings get a dark slate tone to blend with the dark map
            default => '#1e293b' // Slate-800
        };
    }
}
