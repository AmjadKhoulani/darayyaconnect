<?php

namespace App\Observers;

use App\Models\ServiceLog;
use App\Models\Department;

use App\Models\User;
use App\Notifications\ServiceAvailableNotification;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class ServiceLogObserver
{
    public function creating(ServiceLog $serviceLog): void
    {
        // 1. Auto-Assign Department
        if (!$serviceLog->department_id) {
            $slug = match ($serviceLog->service_type) {
                'electricity' => 'electricity',
                'water' => 'water',
                default => 'municipality',
            };

            try {
                $department = Department::where('slug', $slug)->first();
            } catch (\Throwable $e) {
                // Ignore missing table during migration or boot
                $department = null;
            }
            
            if ($department) {
                $serviceLog->department_id = $department->id;
            }
        }

        // 2. Trend Analysis & Alerting (Only if available)
        if ($serviceLog->status === 'available' && $serviceLog->neighborhood) {
            $this->checkTrendAndAlert($serviceLog);
        }
    }

    private function checkTrendAndAlert(ServiceLog $log)
    {
        // 1. Count confirmed logs in this neighborhood OR nearby in the last 60 minutes
        // We use the User's location if available, otherwise fallback to neighborhood string
        $user = $log->user;
        
        if ($user && $user->latitude && $user->longitude) {
            // Spatial Query: Find logs from users within 500m
            $count = ServiceLog::join('users', 'service_logs.user_id', '=', 'users.id')
                ->where('service_logs.service_type', $log->service_type)
                ->where('service_logs.status', 'available')
                ->where('service_logs.created_at', '>=', Carbon::now()->subMinutes(60))
                ->whereRaw("
                    (6371 * acos(cos(radians(?)) * cos(radians(users.latitude)) 
                    * cos(radians(users.longitude) - radians(?)) + sin(radians(?)) 
                    * sin(radians(users.latitude)))) < 0.5
                ", [$user->latitude, $user->longitude, $user->latitude])
                ->count();

            // THRESHOLD: If this is the 5th report
            if ($count >= 5) {
                // Find neighbors within 500m
                $neighbors = User::select('users.*')
                    ->where('id', '!=', $log->user_id)
                    ->whereNotNull('latitude')
                    ->whereNotNull('longitude')
                    ->whereRaw("
                        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) 
                        * cos(radians(longitude) - radians(?)) + sin(radians(?)) 
                        * sin(radians(latitude)))) < 0.5
                    ", [$user->latitude, $user->longitude, $user->latitude])
                    ->get();
                    
                if ($neighbors->count() > 0) {
                     Notification::send($neighbors, new ServiceAvailableNotification($log->service_type, 'منطقتك (تنبيه مكاني)'));
                }
            }
        } else {
            // Fallback: String Match
            $count = ServiceLog::where('neighborhood', $log->neighborhood)
                ->where('service_type', $log->service_type)
                ->where('status', 'available')
                ->where('created_at', '>=', Carbon::now()->subMinutes(60))
                ->count();
            
            if ($count == 4) {
                $neighbors = User::where('neighborhood', $log->neighborhood)
                    ->where('id', '!=', $log->user_id)
                    ->chunk(100, function ($users) use ($log) {
                        Notification::send($users, new ServiceAvailableNotification($log->service_type, $log->neighborhood));
                    });
            }
        }
    }
}
