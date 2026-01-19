<?php

namespace App\Notifications;

use App\Models\Generator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GeneratorPriceUpdateNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Generator $generator,
        public float $oldPrice,
        public float $newPrice
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
        $priceChange = $this->newPrice - $this->oldPrice;
        $changeType = $priceChange > 0 ? 'ارتفع' : 'انخفض';
        
        return [
            'type' => 'generator_price_update',
            'title' => 'تحديث سعر المولد',
            'message' => sprintf(
                '%s سعر المولد "%s" من %s ل.س إلى %s ل.س',
                $changeType,
                $this->generator->name,
                number_format($this->oldPrice, 0),
                number_format($this->newPrice, 0)
            ),
            'generator_id' => $this->generator->id,
            'generator_name' => $this->generator->name,
            'old_price' => $this->oldPrice,
            'new_price' => $this->newPrice,
            'price_change' => $priceChange,
            'action_url' => '/generators',
        ];
    }
}
