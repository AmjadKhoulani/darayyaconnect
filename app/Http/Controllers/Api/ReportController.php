<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Store a new citizen report
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'category' => 'required|in:electricity,water,sanitation,safety,communication,infrastructure,other',
            'severity' => 'required|integer|min:1|max:5',
            'description' => 'required|string|max:1000',
            'location_id' => 'nullable|exists:locations,id',
            'image_path' => 'nullable|string', // Base64 or Path
        ]);

        // Optional: Keep coordinates sync if needed, but primary is lat/long now
        $point = "POINT({$validated['longitude']} {$validated['latitude']})";

        $report = Report::create([
            'user_id' => $request->user()?->id,
            'location_id' => $validated['location_id'] ?? null,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'coordinates' => DB::raw("ST_GeomFromText('$point')"),
            'category' => $validated['category'],
            'severity' => $validated['severity'],
            'description' => $validated['description'],
            'status' => 'pending',
            'images' => isset($validated['image_path']) ? [$validated['image_path']] : null,
        ]);

        return response()->json([
            'message' => 'تم استلام البلاغ بنجاح',
            'id' => $report->id,
        ], 201);
    }

    /**
     * Get heatmap data for reports
     */
    public function heatmap(Request $request)
    {
        $date = $request->query('date') ? \Carbon\Carbon::parse($request->query('date')) : null;

        // Return reports suitable for a heatmap
        // Weighted by severity
        $query = Report::select('latitude', 'longitude', 'severity', 'category')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('status', '!=', 'resolved'); // Only show active issues

        if ($date) {
            $query->whereDate('created_at', $date);
        }

        $reports = $query->limit(1000)->get();

        $formated = $reports->map(function ($report) {
            return [
                $report->latitude,
                $report->longitude,
                $report->severity / 5 // Normalized intensity 0.2 to 1.0
            ];
        });

        return response()->json($formated);
    }
}
