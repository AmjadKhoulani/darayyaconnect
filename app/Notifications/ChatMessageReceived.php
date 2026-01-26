<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChatMessageReceived extends Notification
{
    use Queueable;

    protected $chatMessage;
    protected $channel;

    /**
     * Create a new notification instance.
     */
    public function __construct($chatMessage, $channel)
    {
        $this->chatMessage = $chatMessage;
        $this->channel = $channel;
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
            'type' => 'chat_message',
            'channel_slug' => $this->channel->slug,
            'channel_name' => $this->channel->name,
            'sender_id' => $this->chatMessage->user_id,
            'sender_name' => $this->chatMessage->user->name,
            'message_snippet' => mb_substr($this->chatMessage->body, 0, 100),
            'message_id' => $this->chatMessage->id,
        ];
    }
}
