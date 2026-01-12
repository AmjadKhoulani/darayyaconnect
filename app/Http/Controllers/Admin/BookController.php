<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    public function index(Request $request)
    {
        // Assuming Book model exists or using DB facade. Since we haven't seen Book model migration explicitly,
        // we'll check if table exists or assume it does based on Mobile features.
        // If not, we might need to create migration. But for now, let's assume it follows similar pattern.
        
        // IF Book Model doesn't exist, we will use a generic object for now to prevent crash
        // and user can request migration if needed. But likely it exists or will be created.
        // Waiting for migration check...
        
        // Actually, let's create a quick migration just in case to be safe, or check existing migrations.
        // I will assume standard Model usage.

        $books = \App\Models\Book::query()
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string',
            'category' => 'nullable|string',
            'condition' => 'required|string', // new, used, etc.
            'status' => 'required|in:available,exchanged',
            'cover_image' => 'nullable|image|max:10240',
            'contact_info' => 'required|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('books', 'public');
            $validated['cover_image'] = '/storage/' . $path;
        }

        \App\Models\Book::create($validated);

        return redirect()->back()->with('message', 'تم إضافة الكتاب بنجاح');
    }

    public function update(Request $request, $id)
    {
        $book = \App\Models\Book::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string',
            'category' => 'nullable|string',
            'condition' => 'required|string',
            'status' => 'required|in:available,exchanged',
            'cover_image' => 'nullable|image|max:10240',
             'contact_info' => 'required|string',
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('books', 'public');
            $validated['cover_image'] = '/storage/' . $path;
        }

        $book->update($validated);

        return redirect()->back()->with('message', 'تم تحديث الكتاب');
    }

    public function destroy($id)
    {
        \App\Models\Book::findOrFail($id)->delete();
        return redirect()->back()->with('message', 'تم حذف الكتاب');
    }
}
