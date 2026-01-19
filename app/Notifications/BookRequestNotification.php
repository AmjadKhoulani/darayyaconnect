<?php

namespace App\Notifications;

use App\Models\Book;
use App\Models\BookRequest;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public BookRequest $bookRequest,
        public Book $book,
        public User $requester
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
            'type' => 'book_request',
            'title' => 'طلب استعارة كتاب جديد',
            'message' => sprintf(
                'طلب %s استعارة كتاب "%s"',
                $this->requester->name,
                $this->book->title
            ),
            'book_id' => $this->book->id,
            'book_title' => $this->book->title,
            'request_id' => $this->bookRequest->id,
            'requester_id' => $this->requester->id,
            'requester_name' => $this->requester->name,
            'action_url' => route('admin.books.index'),
        ];
    }
}
