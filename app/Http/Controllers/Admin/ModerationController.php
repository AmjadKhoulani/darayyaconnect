<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Initiative;
use App\Models\Discussion;
use App\Models\Book;
use App\Models\VolunteerOpportunity;
use App\Models\LostFoundItem;
use App\Models\ForbiddenWord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModerationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Moderation/Index', [
            'pending_initiatives' => Initiative::where('moderation_status', 'pending')->with('user:id,name')->get(),
            'pending_discussions' => Discussion::where('moderation_status', 'pending')->with('user:id,name')->get(),
            'pending_books' => Book::where('moderation_status', 'pending')->with('user:id,name')->get(),
            'pending_volunteering' => VolunteerOpportunity::where('moderation_status', 'pending')->get(),
            'pending_lost_found' => LostFoundItem::where('moderation_status', 'pending')->with('user:id,name')->get(),
            'forbidden_words' => ForbiddenWord::latest()->get(),
        ]);
    }

    public function approve(Request $request, $type, $id)
    {
        $model = $this->getModelByType($type);
        if (!$model) return redirect()->back()->with('error', 'Invalid type');

        $item = $model::findOrFail($id);
        $item->update(['moderation_status' => 'approved']);

        return redirect()->back()->with('success', 'تمت الموافقة بنجاح');
    }

    public function reject(Request $request, $type, $id)
    {
        $model = $this->getModelByType($type);
        if (!$model) return redirect()->back()->with('error', 'Invalid type');

        $item = $model::findOrFail($id);
        $item->update(['moderation_status' => 'rejected']);

        return redirect()->back()->with('success', 'تم الرفض بنجاح');
    }

    public function storeForbiddenWord(Request $request)
    {
        $request->validate(['word' => 'required|string|unique:forbidden_words,word']);
        ForbiddenWord::create(['word' => $request->word]);
        return redirect()->back()->with('success', 'تم إضافة الكلمة');
    }

    public function deleteForbiddenWord($id)
    {
        ForbiddenWord::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'تم حذف الكلمة');
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
