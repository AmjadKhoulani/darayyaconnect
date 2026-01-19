<?php

namespace App\Notifications;

use App\Models\Book;
use App\Models\BookRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookRequestStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public BookRequest $bookRequest,
        public Book $book,
        public string $status
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
        $statusMessages = [
            'approved' => 'تمت الموافقة على طلب استعارتك',
            'rejected' => 'تم رفض طلب استعارتك',
            'returned' => 'تم تأكيد إرجاع الكتاب',
        ];

        return [
            'type' => 'book_request_status',
            'title' => $statusMessages[$this->status] ?? 'تحديث حالة الطلب',
            'message' => sprintf(
                '%s لكتاب "%s"',
                $statusMessages[$this->status] ?? 'تم تحديث حالة طلبك',
                $this->book->title
            ),
            'book_id' => $this->book->id,
            'book_title' => $this->book->title,
            'request_id' => $this->bookRequest->id,
            'status' => $this->status,
            'action_url' => '/books',
        ];
    }
}
