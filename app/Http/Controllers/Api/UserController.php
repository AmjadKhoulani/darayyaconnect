<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'mobile' => 'nullable|string|max:20',
            'photo' => 'nullable|image|max:2048', // 2MB Max
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
        ];

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('profile-photos', 'public');
            $data['profile_photo_path'] = $path;
        }

        if ($request->filled('new_password')) {
            if (!\Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'كلمة المرور الحالية غير صحيحة'], 422);
            }
            $data['password'] = \Hash::make($request->new_password);
        }

        $user->update($data);

        // Append full URL to user object
        $user->profile_photo_url = $user->profile_photo_path 
            ? asset('storage/' . $user->profile_photo_path) 
            : null;

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function updateLocation(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('📍 Location Update Request:', $request->all());

        $request->validate([
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_resident' => 'boolean',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user->update([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'is_resident' => $request->is_resident ?? $user->is_resident,
            'location_verified_at' => now(),
        ]);

        return response()->json(['message' => 'Location updated successfully']);
    }
}
