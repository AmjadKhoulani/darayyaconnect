<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarouselItem;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CarouselController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Carousel/Index', [
            'items' => CarouselItem::orderBy('order')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'type' => 'required|string|in:general,global,awareness',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('carousel', 'public');
        }

        CarouselItem::create($validated);

        return redirect()->back()->with('success', 'تمت إضافة العنصر بنجاح');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CarouselItem $carouselItem)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'type' => 'required|string|in:general,global,awareness',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($carouselItem->image_path) {
                Storage::disk('public')->delete($carouselItem->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('carousel', 'public');
        }

        $carouselItem->update($validated);

        return redirect()->back()->with('success', 'تم تحديث العنصر بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CarouselItem $carouselItem)
    {
        if ($carouselItem->image_path) {
            Storage::disk('public')->delete($carouselItem->image_path);
        }
        $carouselItem->delete();

        return redirect()->back()->with('success', 'تم حذف العنصر بنجاح');
    }
}
