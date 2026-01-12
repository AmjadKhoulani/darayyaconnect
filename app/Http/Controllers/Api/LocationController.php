<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class LocationController extends Controller
{
    /**
     * Get all locations as GeoJSON FeatureCollection
     */
    public function index()
    {
        $locations = Location::all();

        $features = $locations->map(function ($location) {
            return [
                'type' => 'Feature',
                'geometry' => json_decode($location->geojson), // ST_AsGeoJSON result
                'properties' => [
                    'id' => $location->id,
                    'type' => $location->type,
                    'status' => $location->status,
                    'metadata' => $location->metadata,
                ],
            ];
        });

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }

    /**
     * Store a new location
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:well,transformer,road,building,density_zone',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'status' => 'required|in:active,damaged,maintenance,unsafe',
            'metadata' => 'nullable|array',
        ]);

        // Create Point Geometry
        $point = "POINT({$validated['longitude']} {$validated['latitude']})";

        $location = Location::create([
            'type' => $validated['type'],
            'status' => $validated['status'],
            'metadata' => $validated['metadata'] ?? [],
            'coordinates' => DB::raw("ST_GeomFromText('$point')"),
        ]);

        return response()->json([
            'message' => 'Location created successfully',
            'id' => $location->id,
        ], 201);
    }
}
