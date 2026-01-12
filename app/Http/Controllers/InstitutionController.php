<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Post;

class InstitutionController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        // Get linked directory entry
        $directoryEntry = DB::table('directory_contacts')
            ->where('user_id', $user->id)
            ->first();

        if (!$directoryEntry) {
            return redirect()->route('dashboard')->with('error', 'No linked institution found.');
        }

        // Get recent posts by this user
        $posts = Post::where('author_name', $user->name) // simplistic linking
                     ->latest()
                     ->take(5)
                     ->get();

        return Inertia::render('Institution/Dashboard', [
            'directoryEntry' => $directoryEntry,
            'posts' => $posts
        ]);
    }

    public function updateStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|string|in:open,closed,busy'
        ]);

        $user = Auth::user();
        
        DB::table('directory_contacts')
            ->where('user_id', $user->id)
            ->update(['status' => $request->status, 'updated_at' => now()]);

        return back()->with('success', 'Status updated successfully');
    }

    public function storePost(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        Post::create([
            'content' => $request->content,
            'author_name' => $user->name,
            'role' => $user->profession ?? 'Institution',
            'type' => 'announcement',
            'likes_count' => 0,
            'comments_count' => 0
        ]);

        return back()->with('success', 'Announcement published!');
    }
}
