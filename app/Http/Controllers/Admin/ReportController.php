<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with('user', 'department');

        // Filter by department if official
        if ($request->user()->role === 'official' && $request->user()->department_id) {
            $query->where('department_id', $request->user()->department_id);
        }

        $reports = $query->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
        ]);
    }

    public function show($id)
    {
        $report = Report::with(['user', 'department', 'infrastructureNode', 'infrastructureLine', 'infrastructurePoint'])
            ->findOrFail($id);

        return Inertia::render('Admin/Reports/Show', [
            'report' => $report,
        ]);
    }

    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        // Security: Officials can only update their own department's reports
        if ($request->user()->role === 'official' && $report->department_id !== $request->user()->department_id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending,in_progress,resolved',
            'official_notes' => 'nullable|string',
        ]);

        $report->update($validated);

        return back()->with('success', 'تم تحديث البلاغ بنجاح');
    }
}
