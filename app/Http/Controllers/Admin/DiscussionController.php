<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscussionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Discussions/Index', [
            'discussions' => Discussion::with('user:id,name')->latest()->paginate(20)
        ]);
    }

    public function update(Request $request, Discussion $discussion)
    {
        $request->validate([
            'moderation_status' => 'required|in:pending,approved,rejected'
        ]);

        $discussion->update([
            'moderation_status' => $request->moderation_status
        ]);

        return redirect()->back()->with('success', 'تم تحديث حالة الموضوع بنجاح');
    }

    public function destroy(Discussion $discussion)
    {
        $discussion->delete();
        return redirect()->back()->with('success', 'تم حذف الموضوع بنجاح');
    }
}
