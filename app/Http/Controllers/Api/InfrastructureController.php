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

    public function index(Request $request)
    {
        \Log::info('Infrastructure index requested', [
            'user_id' => $request->user()?->id,
            'role' => $request->user()?->role
        ]);

        $queryLines = InfrastructureLine::query();
        $queryNodes = InfrastructureNode::query();

        // If not admin, only show published items (Commented out for pilot to show all)
        /*
        if (!$request->user() || $request->user()->role !== 'admin') {
            $queryLines->where('is_published', true);
            $queryNodes->where('is_published', true);
        }
        */

        $lines = $queryLines->get();
        $nodes = $queryNodes->get();

        \Log::info('Infrastructure index returning', [
            'lines_count' => $lines->count(),
            'nodes_count' => $nodes->count()
        ]);

        return response()->json([
            'lines' => $lines,
            'nodes' => $nodes
        ]);
    }

    public function storeLine(Request $request)
    {
        \Log::info('Store line request', $request->all());

        try {
            $validated = $request->validate([
                'type' => 'required|string',
                'coordinates' => 'required|array',
                'status' => 'nullable|string',
                'meta' => 'nullable|array'
            ]);

            $validated['is_published'] = false; // New items are drafts
            
            $line = InfrastructureLine::create($validated);
            \Log::info('Line created', ['id' => $line->id]);
            return response()->json($line, 201);
        } catch (\Exception $e) {
            \Log::error('Store line failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function storeNode(Request $request)
    {
        \Log::info('Store node request', $request->all());

        try {
            $validated = $request->validate([
                'type' => 'required|string',
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'status' => 'nullable|string',
                'meta' => 'nullable|array'
            ]);

            $validated['is_published'] = false; // New items are drafts

            $node = InfrastructureNode::create($validated);
            \Log::info('Node created', ['id' => $node->id]);
            return response()->json($node, 201);
        } catch (\Exception $e) {
            \Log::error('Store node failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function publishLine($id)
    {
        $line = InfrastructureLine::findOrFail($id);
        $line->update(['is_published' => true]);
        return response()->json($line);
    }

    public function publishNode($id)
    {
        $node = InfrastructureNode::findOrFail($id);
        $node->update(['is_published' => true]);
        return response()->json($node);
    }

    public function updateLine(Request $request, $id)
    {
        $line = InfrastructureLine::findOrFail($id);
        $line->update($request->only(['type', 'status', 'meta', 'coordinates', 'is_published']));
        return response()->json($line);
    }

    public function updateNode(Request $request, $id)
    {
        $node = InfrastructureNode::findOrFail($id);
        $node->update($request->only(['type', 'latitude', 'longitude', 'status', 'meta', 'is_published']));
        return response()->json($node);
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
