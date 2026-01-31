<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $settingKey = 'module_' . $module;
        $isEnabled = \App\Models\Setting::getValue($settingKey, '1');

        if ($isEnabled !== '1') {
            abort(404, "This module is currently disabled.");
        }

        return $next($request);
    }
}
