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
        $reports = Report::with('user')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $reports,
        ]);
    }

    public function show($id)
    {
        $report = Report::with(['user', 'infrastructureNode', 'infrastructureLine', 'infrastructurePoint'])
            ->findOrFail($id);

        return Inertia::render('Admin/Reports/Show', [
            'report' => $report,
        ]);
    }
}
