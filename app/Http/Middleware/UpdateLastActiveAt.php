<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastActiveAt
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            // Update only if last update was more than 5 minutes ago to avoid DB spam
            if (!$user->last_active_at || $user->last_active_at->diffInMinutes(now()) > 5) {
                $user->update(['last_active_at' => now()]);
            }
        }

        return $next($request);
    }
}
