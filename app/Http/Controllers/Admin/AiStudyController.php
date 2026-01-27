<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiStudy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiStudyController extends Controller
{
    /**
     * Display the public listing of the resource.
     */
    public function publicIndex(Request $request)
    {
        $query = AiStudy::where('is_published', true);

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('title', 'like', "%{$request->search}%") // Arabic search might need duplication or normalization
                  ->orWhere('summary', 'like', "%{$request->search}%");
            });
        }

        if ($request->category && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $studies = $query->orderBy('display_order')->paginate(9)->withQueryString();

        // Get counts
        $stats = AiStudy::where('is_published', true)
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');
            
        $total = AiStudy::where('is_published', true)->count();

        return Inertia::render('AiStudies', [
            'studies' => $studies,
            'filters' => $request->only(['search', 'category']),
            'stats' => $stats,
            'totalCount' => $total
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/AiStudies/Index', [
            'studies' => AiStudy::orderBy('display_order')->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/AiStudies/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:10',
            'category' => 'required|string|max:50',
            'color' => 'required|string|max:20',
            'gradient' => 'required|string|max:100',
            'summary' => 'required|string',
            'is_published' => 'boolean',
            
            // JSON Fields
            'scenario.current' => 'required|string',
            'scenario.withProject' => 'required|string',
            
            'economics.investment' => 'required|string',
            'economics.investmentRange' => 'nullable|string',
            'economics.revenue' => 'required|string',
            'economics.revenueRange' => 'nullable|string',
            'economics.payback' => 'required|string',
            'economics.jobs' => 'required|string',
            'economics.jobsBreakdown' => 'nullable|string',
            'economics.costBreakdown' => 'array',
            
            'environmental.wasteReduction' => 'nullable|string',
            'environmental.emissions' => 'nullable|string',
            'environmental.waterSaved' => 'nullable|string',
            'environmental.energySaved' => 'nullable|string',

            'social.beneficiaries' => 'required|string',
            'social.impact' => 'required|string',

            'implementation.phase1' => 'required|string',
            'implementation.phase2' => 'required|string',
            'implementation.phase3' => 'required|string',

            'risks' => 'array',
            'recommendations' => 'array',
            'technical_details' => 'array',
        ]);

        AiStudy::create($validated);

        return redirect()->route('admin.ai-studies.index')->with('success', 'تم إنشاء الدراسة بنجاح');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AiStudy $aiStudy)
    {
        return Inertia::render('Admin/AiStudies/Edit', [
            'study' => $aiStudy
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AiStudy $aiStudy)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:10',
            'category' => 'required|string|max:50',
            'color' => 'required|string|max:20',
            'gradient' => 'required|string|max:100',
            'summary' => 'required|string',
            'is_published' => 'boolean',
            
            'scenario.current' => 'required|string',
            'scenario.withProject' => 'required|string',
            
            'economics.investment' => 'required|string',
            'economics.investmentRange' => 'nullable|string',
            'economics.revenue' => 'required|string',
            'economics.revenueRange' => 'nullable|string',
            'economics.payback' => 'required|string',
            'economics.jobs' => 'required|string',
            'economics.jobsBreakdown' => 'nullable|string',
            'economics.costBreakdown' => 'array',

            'environmental.wasteReduction' => 'nullable|string',
            'environmental.emissions' => 'nullable|string',
            'environmental.waterSaved' => 'nullable|string',
            'environmental.energySaved' => 'nullable|string',

            'social.beneficiaries' => 'required|string',
            'social.impact' => 'required|string',

            'implementation.phase1' => 'required|string',
            'implementation.phase2' => 'required|string',
            'implementation.phase3' => 'required|string',

            'risks' => 'array',
            'recommendations' => 'array',
            'technical_details' => 'array',
        ]);

        $aiStudy->update($validated);

        return redirect()->route('admin.ai-studies.index')->with('success', 'تم تحديث الدراسة بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AiStudy $aiStudy)
    {
        $aiStudy->delete();
        return redirect()->back()->with('success', 'تم حذف الدراسة بنجاح');
    }
}
