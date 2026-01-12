<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ServiceAvailableNotification extends Notification
{
    use Queueable;

    private $serviceType;
    private $neighborhood;

    public function __construct($serviceType, $neighborhood)
    {
        $this->serviceType = $serviceType;
        $this->neighborhood = $neighborhood;
    }

    public function via(object $notifiable): array
    {
        return ['database']; // For now, internal notification system
    }

    public function toArray(object $notifiable): array
    {
        $emoji = $this->serviceType === 'electricity' ? '⚡' : '💧';
        $serviceName = $this->serviceType === 'electricity' ? 'الكهرباء' : 'المياه';
        
        return [
            'title' => "وصلت {$serviceName}!",
            'message' => "جيرانك في {$this->neighborhood} يؤكدون توفر الخدمة الآن.",
            'type' => $this->serviceType,
            'action_url' => '/dashboard',
        ];
    }
}
