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
}
