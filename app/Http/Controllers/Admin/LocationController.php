<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Governorate;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class LocationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Locations/Index', [
            'governorates' => Governorate::with('cities.users')->get()->map(function($gov) {
                return [
                    'id' => $gov->id,
                    'name_ar' => $gov->name_ar,
                    'name_en' => $gov->name_en,
                    'code' => $gov->code,
                    'cities' => $gov->cities->map(function($city) {
                        return [
                            'id' => $city->id,
                            'name_ar' => $city->name_ar,
                            'name_en' => $city->name_en,
                            'code' => $city->code,
                            'is_active' => $city->is_active,
                            'admins_count' => $city->users->where('role', 'admin')->count(), // Or specific role
                        ];
                    })
                ];
            })
        ]);
    }

    public function storeCity(Request $request)
    {
        $validated = $request->validate([
            'governorate_id' => 'required|exists:governorates,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:cities,code',
        ]);

        City::create($validated);

        return redirect()->back()->with('success', 'City added successfully');
    }

    public function createAccount(Request $request)
    {
        // Add a new admin for a specific city
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $city = City::findOrFail($request->city_id);
        
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Hash::make($validated['password']),
            'role' => 'admin', // City Admin
            'governorate_id' => $city->governorate_id,
            'city_id' => $city->id,
            'is_resident' => true
        ]);

        return redirect()->back()->with('success', 'City Admin created successfully');
    }
}
