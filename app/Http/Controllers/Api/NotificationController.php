<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->paginate(20);

        // Transform to simple format if needed, or return as is (Laravel resource automatically handles pagination)
        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id = null)
    {
        if ($id && $id !== 'all') {
            $notification = $request->user()->notifications()->where('id', $id)->first();
            if ($notification) {
                $notification->markAsRead();
            }
        } elseif ($id === 'all') {
            $request->user()->unreadNotifications->markAsRead();
        }

        return response()->json(['message' => 'Notifications marked as read']);
    }

    public function unreadCount(Request $request)
    {
        return response()->json([
            'count' => $request->user()->unreadNotifications()->count()
        ]);
    }
}
