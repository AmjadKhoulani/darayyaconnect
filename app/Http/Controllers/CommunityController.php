<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityController extends Controller
{
    public function show($id)
    {
        // We don't need to fetch data here if the React component fetches it via API
        // But for Inertia SEO/SSR it's better to pass it.
        // For now, let's keep it simple and just render the page with the ID
        return Inertia::render('Community/Show', ['id' => $id]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category' => 'required|string',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('discussions', 'public');
        }

        \App\Models\Discussion::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'body' => $request->body,
            'category' => $request->category,
            'image_path' => $imagePath,
        ]);

        return redirect()->back();
    }
}
