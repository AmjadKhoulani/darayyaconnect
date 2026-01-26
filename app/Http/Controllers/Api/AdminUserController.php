<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->role && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate(20);

        return response()->json($users);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', Rule::in(['admin', 'official', 'institution', 'user'])],
            'is_verified_official' => 'boolean',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $user->update([
            'role' => $request->role,
            'is_verified_official' => $request->is_verified_official,
            'department_id' => $request->department_id,
        ]);

        return response()->json(['success' => true, 'user' => $user]);
    }
    
    public function departments()
    {
        return response()->json(\App\Models\Department::all());
    }

    public function activeLocations()
    {
        $users = User::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('last_active_at', '>=', now()->subMinutes(15))
            ->select('id', 'name', 'latitude', 'longitude', 'last_active_at', 'role')
            ->get();

        return response()->json($users);
    }
}
