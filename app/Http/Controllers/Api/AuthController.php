<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الاعتماد غير صحيحة.'],
            ]);
        }

        return response()->json([
            'token' => $user->createToken($request->device_name)->plainTextToken,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'age' => 'required|integer|min:12|max:100',
            'gender' => 'required|string|in:male,female',
            'mobile' => 'required|numeric',
            'country_code' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'age' => $request->age,
            'gender' => $request->gender,
            'role' => 'citizen',
            'mobile' => $request->mobile,
            'country_code' => $request->country_code,
        ]);

        // Send Welcome Email
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\WelcomeMail($user));
        } catch (\Exception $e) {
            // Log error but don't fail registration
            \Illuminate\Support\Facades\Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        return response()->json([
            'token' => $user->createToken('mobile_app')->plainTextToken,
            'user' => $user
        ]);
    }
}
