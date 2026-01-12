<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Filter by Role
        if ($request->role && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by Status
        if ($request->status) {
            if ($request->status === 'verified') {
                $query->where('is_verified_official', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_verified_official', false)
                      ->whereIn('role', ['official', 'institution']);
            }
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
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

        return back()->with('success', 'تم تحديث بيانات المستخدم بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'لا يمكنك حذف حسابك الحالي');
        }

        $user->delete();

        return back()->with('success', 'تم حذف المستخدم بنجاح');
    }

    public function map()
    {
        $users = User::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select('id', 'name', 'role', 'latitude', 'longitude')
            ->get();

        return Inertia::render('Admin/Users/Map', [
            'users' => $users
        ]);
    }
}

