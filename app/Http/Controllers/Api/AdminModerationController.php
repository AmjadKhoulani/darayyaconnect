<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Initiative;
use App\Models\Discussion;
use App\Models\Book;
use App\Models\VolunteerOpportunity;
use App\Models\LostFoundItem;
use Illuminate\Http\Request;

class AdminModerationController extends Controller
{
    public function pending()
    {
        return response()->json([
            'initiatives' => Initiative::where('moderation_status', 'pending')->with('user:id,name')->latest()->get(),
            'discussions' => Discussion::where('moderation_status', 'pending')->with('user:id,name')->latest()->get(),
            'books' => Book::where('moderation_status', 'pending')->with('user:id,name')->latest()->get(),
            'volunteering' => VolunteerOpportunity::where('moderation_status', 'pending')->latest()->get(),
            'lost_found' => LostFoundItem::where('moderation_status', 'pending')->with('user:id,name')->latest()->get(),
        ]);
    }

    public function approve($type, $id)
    {
        $model = $this->getModelByType($type);
        if (!$model) return response()->json(['message' => 'Invalid type'], 400);

        $item = $model::findOrFail($id);
        $item->update(['moderation_status' => 'approved']);

        return response()->json(['success' => true]);
    }

    public function reject($type, $id)
    {
        $model = $this->getModelByType($type);
        if (!$model) return response()->json(['message' => 'Invalid type'], 400);

        $item = $model::findOrFail($id);
        $item->update(['moderation_status' => 'rejected']);

        return response()->json(['success' => true]);
    }

    private function getModelByType($type)
    {
        return match ($type) {
            'initiative' => Initiative::class,
            'discussion' => Discussion::class,
            'book' => Book::class,
            'volunteering' => VolunteerOpportunity::class,
            'lost_found' => LostFoundItem::class,
            default => null,
        };
    }
}
