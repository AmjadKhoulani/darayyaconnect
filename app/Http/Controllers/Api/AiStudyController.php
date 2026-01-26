<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiStudy;
use Illuminate\Http\Request;

class AiStudyController extends Controller
{
    public function index(Request $request)
    {
        $query = AiStudy::where('is_published', true);

        if ($request->category) {
            $query->where('category', $request->category);
        }

        if ($request->tags) {
            $query->where('tags', $request->tags);
        }

        if ($request->search) {
             $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('summary', 'like', "%{$request->search}%");
        }

        return response()->json(
            $query->latest()->paginate(100)
        );
    }

    public function show($id)
    {
        $study = AiStudy::where('is_published', true)->findOrFail($id);
        return response()->json($study);
    }

    public function featured()
    {
        return response()->json(
            AiStudy::where('is_published', true)
                ->where('is_featured', true)
                ->latest()
                ->take(5)
                ->get()
        );
    }
}
