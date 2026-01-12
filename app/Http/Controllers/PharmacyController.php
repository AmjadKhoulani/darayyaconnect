<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PharmacyController extends Controller
{
    public function toggleDuty(Request $request)
    {
        $user = Auth::user();

        if ($user->profession !== 'pharmacist') {
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:open,closed'
        ]);

        // Find or create directory entry for this pharmacist
        DB::table('directory_contacts')->updateOrInsert(
            ['user_id' => $user->id],
            [
                'name' => $user->name, // Or a specific pharmacy name if we had a field
                'role' => 'صيدلية مناوبة',
                'category' => 'health',
                'status' => $request->status,
                'updated_at' => now(),
            ]
        );

        return back()->with('success', 'تم تحديث حالة المناوبة بنجاح');
    }
}
