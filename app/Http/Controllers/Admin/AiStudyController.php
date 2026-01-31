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
     * Display the specified resource publically.
     */
    public function publicShow($id)
    {
        $study = AiStudy::where('is_published', true)->findOrFail($id);

        return Inertia::render('AiStudies/Show', [
            'study' => $study
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
            'is_featured' => 'boolean',
            
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

        $study = AiStudy::create($validated);

        // If featured, create/update carousel item
        if ($validated['is_featured'] ?? false) {
            $this->syncCarouselItem($study);
        }

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
            'is_featured' => 'boolean',
            
            'scenario.current' => 'nullable|string',
            'scenario.withProject' => 'nullable|string',
            
            'economics.investment' => 'nullable|string',
            'economics.investmentRange' => 'nullable|string',
            'economics.revenue' => 'nullable|string',
            'economics.revenueRange' => 'nullable|string',
            'economics.payback' => 'nullable|string',
            'economics.jobs' => 'nullable|string',
            'economics.jobsBreakdown' => 'nullable|string',
            'economics.costBreakdown' => 'array',

            'environmental.wasteReduction' => 'nullable|string',
            'environmental.emissions' => 'nullable|string',
            'environmental.waterSaved' => 'nullable|string',
            'environmental.energySaved' => 'nullable|string',

            'social.beneficiaries' => 'nullable|string',
            'social.impact' => 'nullable|string',

            'implementation.phase1' => 'nullable|string',
            'implementation.phase2' => 'nullable|string',
            'implementation.phase3' => 'nullable|string',

            'risks' => 'array',
            'recommendations' => 'array',
            'technical_details' => 'array',
        ]);

        $wasFeatured = $aiStudy->is_featured;
        \Log::info('AiStudy Update: ID=' . $aiStudy->id . ', Was featured: ' . ($wasFeatured ? 'YES' : 'NO'));
        
        $aiStudy->update($validated);
        $isFeatured = $validated['is_featured'] ?? false;
        
        \Log::info('AiStudy Update: New featured status: ' . ($isFeatured ? 'YES' : 'NO'));

        // Handle carousel item creation/deletion based on featured status
        if ($isFeatured && !$wasFeatured) {
            \Log::info('AiStudy Update: Syncing new carousel item');
            $this->syncCarouselItem($aiStudy);
        } elseif (!$isFeatured && $wasFeatured) {
            \Log::info('AiStudy Update: Removing carousel item');
            $this->removeCarouselItem($aiStudy);
        } elseif ($isFeatured) {
            \Log::info('AiStudy Update: Updating existing carousel item');
            $this->syncCarouselItem($aiStudy);
        }

        return redirect()->route('admin.ai-studies.index')->with('success', 'تم تحديث الدراسة بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AiStudy $aiStudy)
    {
        // Remove carousel item if exists
        if ($aiStudy->is_featured) {
            $this->removeCarouselItem($aiStudy);
        }
        
        $aiStudy->delete();
        return redirect()->back()->with('success', 'تم حذف الدراسة بنجاح');
    }

    /**
     * Sync carousel item for featured study
     */
    private function syncCarouselItem(AiStudy $study)
    {
        try {
            // Extract gradient colors from Tailwind class (e.g., 'from-blue-500 to-indigo-600')
            $gradientStyle = $this->convertGradientToStyle($study->gradient);
            
            $carouselItem = \App\Models\CarouselItem::where('type', 'ai_study')
                ->where('button_link', route('ai-studies'))
                ->where('title', $study->title)
                ->first();

            $data = [
                'title' => $study->title,
                'description' => $study->summary,
                'image_type' => 'gradient',
                'gradient' => $study->gradient, // Store the Tailwind class
                'button_text' => 'اقرأ المزيد',
                'button_link' => route('ai-studies'), // Link to studies page
                'type' => 'ai_study',
                'order' => $study->display_order ?? 0,
                'is_active' => $study->is_published,
            ];

            if ($carouselItem) {
                \Log::info('SyncCarouselItem: Updating existing item ID ' . $carouselItem->id);
                $carouselItem->update($data);
            } else {
                \Log::info('SyncCarouselItem: Creating new item');
                \App\Models\CarouselItem::create($data);
            }
        } catch (\Exception $e) {
            \Log::error('SyncCarouselItem Error: ' . $e->getMessage());
        }
    }

    /**
     * Convert Tailwind gradient class to inline style
     */
    private function convertGradientToStyle($gradientClass)
    {
        // Map of Tailwind gradient classes to actual colors
        $colorMap = [
            'from-blue-500 to-indigo-600' => 'linear-gradient(to bottom right, #3b82f6, #4f46e5)',
            'from-green-500 to-cyan-600' => 'linear-gradient(to bottom right, #10b981, #0891b2)',
            'from-orange-500 to-pink-600' => 'linear-gradient(to bottom right, #f97316, #db2777)',
            'from-red-500 to-orange-600' => 'linear-gradient(to bottom right, #ef4444, #ea580c)',
            'from-purple-500 to-pink-600' => 'linear-gradient(to bottom right, #a855f7, #db2777)',
            'from-teal-500 to-emerald-600' => 'linear-gradient(to bottom right, #14b8a6, #059669)',
        ];

        return $colorMap[$gradientClass] ?? 'linear-gradient(to bottom right, #3b82f6, #4f46e5)';
    }

    /**
     * Remove carousel item for study
     */
    private function removeCarouselItem(AiStudy $study)
    {
        \App\Models\CarouselItem::where('type', 'ai_study')
            ->where('button_link', route('ai-studies'))
            ->where('title', $study->title)
            ->delete();
    }
}
