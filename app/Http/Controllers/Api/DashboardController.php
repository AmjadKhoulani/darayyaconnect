<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\News;
use App\Models\Discussion;
use App\Models\Report;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        // Get city statistics
        $stats = [
            'population' => 78000, // Static for now
            'activeUsers' => User::where('last_active_at', '>=', now()->subDays(7))->count(),
            'reports' => Report::where('created_at', '>=', now()->subMonth())->count()
        ];

        return response()->json($stats);
    }

    public function getRecentNews(Request $request)
    {
        $news = News::with('user:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'excerpt' => $item->excerpt ?? substr($item->content, 0, 100) . '...',
                    'author' => $item->user->name ?? 'مجلس المدينة',
                    'created_at' => $item->created_at->diffForHumans(),
                    'category' => $item->category ?? 'news'
                ];
            });

        return response()->json($news);
    }

    public function getDiscussionsPreview(Request $request)
    {
        $discussions = Discussion::with('user:id,name')
            ->withCount('replies')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($discussion) {
                return [
                    'id' => $discussion->id,
                    'title' => $discussion->title,
                    'author' => $discussion->user->name,
                    'replies_count' => $discussion->replies_count,
                    'created_at' => $discussion->created_at->diffForHumans()
                ];
            });

        return response()->json($discussions);
    }
}
