<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = DB::table('departments')->get();
        $rules = DB::table('department_routing_rules')
            ->join('departments', 'department_routing_rules.department_id', '=', 'departments.id')
            ->select('department_routing_rules.*', 'departments.name as department_name')
            ->get();

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
            'rules' => $rules
        ]);
    }

    public function updateRule(Request $request)
    {
        // Simple update or create rule
        $validated = $request->validate([
            'category' => 'nullable|string',
            'infrastructure_type' => 'nullable|string',
            'department_id' => 'required|exists:departments,id'
        ]);

        DB::table('department_routing_rules')->updateOrInsert(
            [
                'category' => $validated['category'], 
                'infrastructure_type' => $validated['infrastructure_type']
            ],
            ['department_id' => $validated['department_id'], 'updated_at' => now()]
        );

        return back();
    }
}
