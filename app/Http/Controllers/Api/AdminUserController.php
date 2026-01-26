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

    public function activeLocations(Request $request)
    {
        $search = $request->search;
        $usersQuery = User::query();

        if ($search) {
            // Search Mode: Find any user with location matching name
            $usersQuery->where('name', 'like', "%{$search}%")
                  ->whereNotNull('latitude')
                  ->whereNotNull('longitude');
        } else {
            // Default Mode: Only Active SOS
            $usersQuery->whereHas('sosAlerts', function ($q) {
                $q->where('status', 'active');
            });
        }

        $users = $usersQuery
            ->with(['sosAlerts' => function ($q) {
                $q->where('status', 'active')->latest()->limit(1);
            }])
            ->select('id', 'name', 'latitude', 'longitude', 'last_active_at', 'role', 'profile_photo_path')
            ->get()
            ->map(function ($user) {
                $sos = $user->sosAlerts->first();
                if ($sos) {
                    // Override location with live SOS tracking if available
                    $user->is_sos = true;
                    $user->sos_type = $sos->emergency_type;
                    $user->sos_message = $sos->message;
                    $user->latitude = $sos->current_latitude ?? $sos->latitude; // Dynamic SOS lat
                    $user->longitude = $sos->current_longitude ?? $sos->longitude; // Dynamic SOS lng
                    $user->sos_started_at = $sos->created_at;
                } else {
                    $user->is_sos = false;
                }
                unset($user->sosAlerts);
                return $user;
            });

        return response()->json($users);
    }
}
