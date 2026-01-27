<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InfrastructurePoint;
use App\Services\ProjectScoreService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InfrastructureManagerController extends Controller
{
    public function index()
    {
        return Inertia::render('Infrastructure/Index', [
            'points' => InfrastructurePoint::orderBy('type')->orderBy('name')->get()
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,maintenance,stopped,critical'
        ]);

        $point = InfrastructurePoint::findOrFail($id);
        $point->update(['status' => $request->status, 'last_updated_at' => now()]);

        // Trigger Priority Recalculation (Optional)
        // (new ProjectScoreService())->recalculateAll();

        return back()->with('success', 'تم تحديث الحالة بنجاح');
    }

    public function waterManager()
    {
        return Inertia::render('Admin/Infrastructure/WaterManager', [
            'zones' => InfrastructurePoint::where('type', 'water_zone')->orderBy('name')->get()
        ]);
    }
    public function editor($sector)
    {
        if (!in_array($sector, ['water', 'electricity', 'sewage', 'phone'])) {
            abort(404);
        }

        return Inertia::render('Admin/Infrastructure/Editor', [
            'sector' => $sector
        ]);
    }

    public function inventory(Request $request)
    {
        $user = $request->user();
        $queryLines = \App\Models\InfrastructureLine::query();
        $queryNodes = \App\Models\InfrastructureNode::query();

        // Official filtering logic
        if ($user->role === 'official' && $user->department) {
            $slug = $user->department->slug;
             $deptMap = [
                'water' => ['water_tank', 'pump', 'valve', 'water_pipe_main', 'water_pipe_distribution'],
                'electricity' => ['transformer', 'pole', 'generator', 'power_cable_underground', 'power_line_overhead'],
                'municipality' => ['manhole', 'sewage_pipe', 'pothole', 'garbage_pile'],
                'telecom' => ['exchange', 'cabinet', 'telecom_cable']
            ];
            $allowedTypes = $deptMap[$slug] ?? [];

            if (!empty($allowedTypes)) {
                $queryLines->where(function($q) use ($allowedTypes) {
                    $q->where('is_published', true)->orWhereIn('type', $allowedTypes);
                });
                $queryNodes->where(function($q) use ($allowedTypes) {
                    $q->where('is_published', true)->orWhereIn('type', $allowedTypes);
                });
            }
        }

        return Inertia::render('Admin/Infrastructure/Inventory', [
            'lines' => $queryLines->latest()->get(),
            'nodes' => $queryNodes->latest()->get()
        ]);
    }

    public function show($type, $id)
    {
        if ($type === 'node') {
            $asset = \App\Models\InfrastructureNode::findOrFail($id);
        } elseif ($type === 'line') {
            $asset = \App\Models\InfrastructureLine::findOrFail($id);
        } else {
            abort(404);
        }

        return Inertia::render('Admin/Infrastructure/Show', [
            'asset' => $asset,
            'type' => $type
        ]);
    }
}
