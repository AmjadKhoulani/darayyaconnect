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
            'infrastructure_node_id' => 'nullable|exists:infrastructure_nodes,id',
            'infrastructure_line_id' => 'nullable|exists:infrastructure_lines,id',
        ]);

        try {
            // Auto-Assign Department based on Routing Rules
            // 1. Check for specific infrastructure type rule
            $deptId = null;
            if ($validated['infrastructure_type'] ?? null) {
                $rule = \Illuminate\Support\Facades\DB::table('department_routing_rules')
                    ->where('infrastructure_type', $validated['infrastructure_type'])
                    ->first();
                if ($rule) $deptId = $rule->department_id;
            }

            // 2. Fallback to category rule
            if (!$deptId) {
                 // Use mapping for category
                 $category = match ($validated['type']) {
                    'water_leak', 'no_water', 'dirty_water' => 'water',
                    'power_outage', 'wire_spark', 'transformer_issue' => 'electricity',
                    'sewage_overflow', 'blocked_drain' => 'sanitation',
                    'pothole', 'road_damage' => 'road',
                    'garbage_pile', 'missed_pickup' => 'trash',
                    'street_light_out' => 'lighting',
                    'internet_down', 'phone_line_cut' => 'communication',
                    default => 'other',
                };

                $rule = \Illuminate\Support\Facades\DB::table('department_routing_rules')
                    ->where('category', $category)
                    ->first();
                if ($rule) $deptId = $rule->department_id;
            }

            $routing = [
                'category' => $category ?? 'other',
                'dept_id' => $deptId
            ];
            
            $reportData = [
                'user_id' => auth('sanctum')->user()?->id,
                'category' => $routing['category'],
                'department_id' => $routing['dept_id'],
                'department_assigned' => $routing['dept_id'] ? true : false,
                'infrastructure_node_id' => $validated['infrastructure_node_id'] ?? null,
                'infrastructure_line_id' => $validated['infrastructure_line_id'] ?? null,
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
                'message' => 'Success',
                'id' => $report->id
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Report submission error: ' . $e->getMessage());
            return response()->json([
                'message' => 'حدث خطأ أثناء حفظ البلاغ',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    private function mapTypeToCategoryAndDept($type)
    {
        $map = [
            'water' => ['category' => 'water', 'dept' => 'water'],
            'electricity' => ['category' => 'electricity', 'dept' => 'electricity'],
            'lighting' => ['category' => 'electricity', 'dept' => 'electricity'], // Added lighting
            'sewage' => ['category' => 'sanitation', 'dept' => 'municipality'],
            'trash' => ['category' => 'sanitation', 'dept' => 'municipality'], // Added trash (sanitation)
            'phone' => ['category' => 'communication', 'dept' => 'telecom'],
            'infrastructure' => ['category' => 'infrastructure', 'dept' => 'municipality'],
            'other' => ['category' => 'other', 'dept' => 'municipality'],
        ];
        
        $res = $map[$type] ?? ['category' => 'other', 'dept' => 'municipality'];
        
        $dept = \App\Models\Department::where('slug', $res['dept'])->first();
        // Fallback: If department not found, don't crash, just leave it null.
        // Also ensure category is valid enum
        $validCategories = ['electricity', 'water', 'sanitation', 'safety', 'communication', 'infrastructure', 'other'];
        if (!in_array($res['category'], $validCategories)) {
            $res['category'] = 'other';
        }
        $res['dept_id'] = $dept ? $dept->id : null;
        
        return $res;
    }

    public function index(Request $request)
    {
        \Log::info('Infrastructure index requested', [
            'user_id' => $request->user()?->id,
            'role' => $request->user()?->role
        ]);

        $queryLines = InfrastructureLine::query();
        $queryNodes = InfrastructureNode::query();

        // If not admin or official, only show published items
        if (!$request->user() || !in_array($request->user()->role, ['admin', 'official'])) {
            $queryLines->where('is_published', true);
            $queryNodes->where('is_published', true);
        }

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

    public function myReports(Request $request)
    {
        $reports = Report::where('user_id', $request->user()->id)
            ->with(['infrastructureNode', 'infrastructureLine'])
            ->latest()
            ->get();

        return response()->json($reports);
    }

    public function storeLine(Request $request)
    {
        \Log::info('Store line request', $request->all());

        try {
            $validated = $request->validate([
                'type' => 'required|string',
                'serial_number' => 'nullable|string',
                'coordinates' => 'required|array',
                'status' => 'nullable|string',
                'meta' => 'nullable|array'
            ]);

            $validated['is_published'] = true; // Auto-publish from Map Editor
            
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
                'serial_number' => 'nullable|string|unique:infrastructure_nodes,serial_number',
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'status' => 'nullable|string',
                'meta' => 'nullable|array'
            ]);

            $validated['is_published'] = true; // Auto-publish from Map Editor

            $node = InfrastructureNode::create($validated);
            \Log::info('Node created', ['id' => $node->id, 'is_published' => $node->is_published]);
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
        $line->update($request->only(['type', 'serial_number', 'status', 'meta', 'coordinates', 'is_published']));
        return response()->json($line);
    }

    public function updateNode(Request $request, $id)
    {
        $node = InfrastructureNode::findOrFail($id);
        $node->update($request->only(['type', 'serial_number', 'latitude', 'longitude', 'status', 'meta', 'is_published']));
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

    public function publishAll(Request $request)
    {
        $validated = $request->validate([
            'sector' => 'required|string'
        ]);

        $sector = $validated['sector'];
        
        // Define types for each sector (should match client-side SECTOR_CONFIG)
        $sectorTypes = [
            'water' => ['water_tank', 'pump', 'valve', 'water_pipe_main', 'water_pipe_distribution'],
            'electricity' => ['transformer', 'pole', 'generator', 'power_cable_underground', 'power_line_overhead'],
            'sewage' => ['manhole', 'sewage_pipe'],
            'phone' => ['exchange', 'cabinet', 'telecom_cable']
        ];

        $types = $sectorTypes[$sector] ?? [];

        if (empty($types)) {
            return response()->json(['message' => 'Invalid sector'], 400);
        }

        $linesUpdated = InfrastructureLine::whereIn('type', $types)
            ->where('is_published', false)
            ->update(['is_published' => true]);

        $nodesUpdated = InfrastructureNode::whereIn('type', $types)
            ->where('is_published', false)
            ->update(['is_published' => true]);

        return response()->json([
            'message' => 'تم نشر كافة التعديلات بنجاح',
            'lines_count' => $linesUpdated,
            'nodes_count' => $nodesUpdated
        ]);
    }

    public function getAssetReports(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string', // 'node' or 'line'
            'id' => 'required|numeric',
        ]);

        $asset = $validated['type'] === 'node' 
            ? InfrastructureNode::findOrFail($validated['id'])
            : InfrastructureLine::findOrFail($validated['id']);

        $categoryMap = [
            'water_tank' => 'water',
            'pump' => 'water',
            'valve' => 'water',
            'water_pipe_main' => 'water',
            'water_pipe_distribution' => 'water',
            'transformer' => 'electricity',
            'pole' => 'electricity',
            'generator' => 'electricity',
            'power_cable_underground' => 'electricity',
            'power_line_overhead' => 'electricity',
            'manhole' => 'sanitation',
            'sewage_pipe' => 'sanitation',
            'exchange' => 'communication',
            'cabinet' => 'communication',
            'telecom_cable' => 'communication',
        ];

        $category = $categoryMap[$asset->type] ?? 'other';

        $query = Report::where('category', $category)
            ->where('status', '!=', 'resolved')
            ->orderBy('created_at', 'desc');

        // Simple radius check if it's a node
        if ($validated['type'] === 'node') {
            $lat = $asset->latitude;
            $lng = $asset->longitude;
            
            // Approx 100m radius using simple box for performance
            $query->whereBetween('latitude', [$lat - 0.001, $lat + 0.001])
                  ->whereBetween('longitude', [$lng - 0.001, $lng + 0.001]);
        }

        $reports = $query->with('user')->get();

        return response()->json($reports);
    }

    public function publicReports()
    {
        $reports = Report::whereIn('status', ['pending', 'in_progress'])
            ->select('id', 'category', 'description', 'latitude', 'longitude', 'status', 'created_at')
            ->latest()
            ->limit(500)
            ->get();

        $features = $reports->map(function ($report) {
            return [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [
                        (float) $report->longitude,
                        (float) $report->latitude,
                    ]
                ],
                'properties' => [
                    'id' => $report->id,
                    'category' => $report->category,
                    'status' => $report->status,
                    'title' => substr($report->description, 0, 50) . (strlen($report->description) > 50 ? '...' : ''),
                    'created_at' => $report->created_at ? $report->created_at->diffForHumans() : '',
                ]
            ];
        });

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features
        ]);
    }

    public function adminDashboardData()
    {
        $stats = [
            'reports_pending' => \App\Models\Report::whereIn('status', ['received', 'pending'])->count(),
            'citizens_count' => \App\Models\User::count(),
            'active_alerts' => \App\Models\ServiceAlert::active()->count(),
            'moderation_pending' => 
                \App\Models\Initiative::where('moderation_status', 'pending')->count() +
                \App\Models\Discussion::where('moderation_status', 'pending')->count() +
                \App\Models\Book::where('moderation_status', 'pending')->count() +
                \App\Models\VolunteerOpportunity::where('moderation_status', 'pending')->count() +
                \App\Models\LostFoundItem::where('moderation_status', 'pending')->count(),
        ];

        return response()->json([
            'stats' => $stats,
            'total_reports' => \App\Models\Report::count(), // keep for legacy if needed
        ]);
    }

    public function govDashboardData(Request $request)
    {
        $user = $request->user();
        if (!$user->department_id) {
            return response()->json(['message' => 'User not assigned to a department'], 403);
        }

        $reports = Report::where('department_id', $user->department_id)
            ->with('user')
            ->latest()
            ->get();

        $stats = [
            'total' => $reports->count(),
            'pending' => $reports->where('status', 'pending')->count(),
            'in_progress' => $reports->where('status', 'in_progress')->count(),
            'resolved' => $reports->where('status', 'resolved')->count(),
        ];

        return response()->json([
            'reports' => $reports,
            'stats' => $stats,
            'department_name' => $user->department?->name
        ]);
    }

    public function showReport($id)
    {
        $report = Report::with(['user', 'department', 'infrastructureNode', 'infrastructureLine'])->findOrFail($id);
        return response()->json($report);
    }

    public function updateReport(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        
        // Security check
        if ($request->user()->role === 'official' && $report->department_id !== $request->user()->department_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending,in_progress,resolved',
            'official_notes' => 'nullable|string',
        ]);

        $report->update($validated);

        return response()->json(['message' => 'Report updated successfully', 'report' => $report]);
    }
}
