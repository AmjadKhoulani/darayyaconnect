<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DirectoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectoryController extends Controller
{
    public function index()
    {
        $items = DirectoryItem::orderBy('name')->get();
        return Inertia::render('Admin/Directory/Index', [
            'items' => $items
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'type' => 'required|string|max:50',
            'category' => 'required|string|in:official,company,emergency,health',
            'icon' => 'nullable|string',
        ]);

        DirectoryItem::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $item = DirectoryItem::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'type' => 'required|string|max:50',
            'category' => 'required|string|in:official,company,emergency,health',
            'icon' => 'nullable|string',
        ]);

        $item->update($validated);

        return redirect()->back();
    }

    public function destroy($id)
    {
        DirectoryItem::findOrFail($id)->delete();
        return redirect()->back();
    }
}
