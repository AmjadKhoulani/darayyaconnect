<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiRecommendation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AiRecommendationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // In a real scenario, this would call an AI service or run a model.
        // For now, we return existing recommendations or mock some data if none exist.
        $recommendations = AiRecommendation::where('user_id', $user->id)
            ->orderBy('score', 'desc')
            ->limit(5)
            ->get();

        if ($recommendations->isEmpty()) {
            // Mocking some initial recommendations if the user has none
            return response()->json([
                [
                    'id' => 1,
                    'item_type' => 'service',
                    'title' => 'مركز خدمة المواطن - داريا',
                    'description' => 'يمكنك الحصول على كافة الأوراق الرسمية من هنا.',
                    'image' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400',
                ],
                [
                    'id' => 2,
                    'item_type' => 'event',
                    'title' => 'مشروع تنظيف شوارع المنطقة الشمالية',
                    'description' => 'ساهم معنا في حملة النظافة الأسبوعية القادمة.',
                    'image' => 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
                ],
                [
                    'id' => 3,
                    'item_type' => 'initiative',
                    'title' => 'توزيع مساعدات شتوية',
                    'description' => 'مبادرة لتوزيع الوقود والأغطية للعائلات المحتاجة.',
                    'image' => 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400',
                ]
            ]);
        }

        return response()->json($recommendations);
    }

    public function feedback(Request $request)
    {
        $request->validate([
            'item_id' => 'required',
            'item_type' => 'required',
            'feedback' => 'required|in:like,dislike',
        ]);

        // Logic to update model/recommendation scoring would go here
        
        return response()->json(['message' => 'Feedback received successfully']);
    }
}
