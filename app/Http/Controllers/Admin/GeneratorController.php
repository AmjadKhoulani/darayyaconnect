<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Generator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeneratorController extends Controller
{
    public function index(Request $request)
    {
        $generators = Generator::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('neighborhood', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Generators/Index', [
            'generators' => $generators,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'ampere_price' => 'required|numeric',
            'status' => 'required|in:active,down,maintenance',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $validated['user_id'] = $request->user()->id; // Assume admin owns it for now if created here
        
        Generator::create($validated);

        return redirect()->back()->with('message', 'تم إضافة المولدة بنجاح');
    }

    public function update(Request $request, Generator $generator)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'ampere_price' => 'required|numeric',
            'status' => 'required|in:active,down,maintenance',
        ]);

        $generator->update($validated);

        return redirect()->back()->with('message', 'تم تحديث بيانات المولدة');
    }

    public function destroy(Generator $generator)
    {
        $generator->delete();
        return redirect()->back()->with('message', 'تم حذف المولدة');
    }
}
