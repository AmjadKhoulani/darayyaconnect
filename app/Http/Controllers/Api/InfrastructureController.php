<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InfrastructureLine;
use App\Models\InfrastructureNode;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InfrastructureController extends Controller
{
    public function storeReport(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'image' => 'nullable|image|max:10240', // 10MB max
        ]);

        try {
            $reportData = [
                'user_id' => $request->user()?->id,
                'category' => $this->mapTypeToCategory($validated['type']),
                'description' => $validated['title'] . "\n\n" . $validated['description'],
                'status' => 'pending',
                'severity' => 2,
            ];

            // Save textual lat/long for backup and ease of use
            if (isset($validated['latitude']) && isset($validated['longitude'])) {
                $reportData['latitude'] = $validated['latitude'];
                $reportData['longitude'] = $validated['longitude'];
                
                // Save geometry
                $point = "POINT({$validated['longitude']} {$validated['latitude']})";
                $reportData['coordinates'] = DB::raw("ST_GeomFromText('$point')");
            }

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('reports', 'public');
                $reportData['images'] = json_encode([asset('storage/' . $path)]);
            }

            $report = Report::create($reportData);

            return response()->json([
                'message' => 'تم استلام البلاغ بنجاح',
                'id' => $report->id
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Report submission error: ' . $e->getMessage());
            return response()->json([
                'message' => 'حدث خطأ أثناء حفظ البلاغ',
                'error' => $e->getMessage() // Dev only, remove in prod
            ], 500);
        }
    }

    private function mapTypeToCategory($type)
    {
        $map = [
            'infrastructure' => 'sanitation', // generic mapping
            'trash' => 'sanitation',
            'lighting' => 'electricity',
            'other' => 'safety'
        ];
        return $map[$type] ?? 'safety';
    }

    public function index()
    {
        return response()->json([
            'lines' => InfrastructureLine::all(),
            'nodes' => InfrastructureNode::all()
        ]);
    }

    public function storeLine(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'coordinates' => 'required|array',
            'status' => 'nullable|string',
            'meta' => 'nullable|array'
        ]);

        $line = InfrastructureLine::create($validated);
        return response()->json($line, 201);
    }

    public function storeNode(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'status' => 'nullable|string',
            'meta' => 'nullable|array'
        ]);

        $node = InfrastructureNode::create($validated);
        return response()->json($node, 201);
    }

    public function destroyLine($id)
    {
        InfrastructureLine::destroy($id);
        return response()->json(null, 204);
    }

    public function destroyNode($id)
    {
        InfrastructureNode::destroy($id);
        return response()->json(null, 204);
    }
}
