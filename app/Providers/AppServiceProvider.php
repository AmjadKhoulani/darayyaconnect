<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        try {
            if (class_exists(\App\Models\ServiceLog::class) && class_exists(\App\Observers\ServiceLogObserver::class)) {
                \App\Models\ServiceLog::observe(\App\Observers\ServiceLogObserver::class);
            }
        } catch (\Throwable $e) {
            // Ignore during boot if class not found
        }
        Vite::prefetch(concurrency: 3);
    }
}
