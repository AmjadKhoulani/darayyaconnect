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
        // Count confirmed logs in this neighborhood in the last 60 minutes
        $count = ServiceLog::where('neighborhood', $log->neighborhood)
            ->where('service_type', $log->service_type)
            ->where('status', 'available')
            ->where('created_at', '>=', Carbon::now()->subMinutes(60))
            ->count();

        // THRESHOLD: If this is the 5th report (User requested 5)
        if ($count == 4) { // 4 existing + this one = 5
            // Find neighbors who haven't logged recently
            $neighbors = User::where('neighborhood', $log->neighborhood)
                ->where('id', '!=', $log->user_id) // Don't notify self
                ->chunk(100, function ($users) use ($log) {
                    Notification::send($users, new ServiceAvailableNotification($log->service_type, $log->neighborhood));
                });
        }
    }
}
