<?php

namespace App\Notifications;

use App\Models\Generator;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GeneratorIssueNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Generator $generator,
        public User $reporter,
        public string $issue
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'generator_issue',
            'title' => 'مشكلة في المولد',
            'message' => sprintf(
                'تم الإبلاغ عن مشكلة في المولد "%s": %s',
                $this->generator->name,
                $this->issue
            ),
            'generator_id' => $this->generator->id,
            'generator_name' => $this->generator->name,
            'reporter_id' => $this->reporter->id,
            'reporter_name' => $this->reporter->name,
            'issue' => $this->issue,
            'action_url' => '/generators',
        ];
    }
}
