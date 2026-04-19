<?php
namespace App\Notifications;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WinnerAnnounced extends Notification
{
    use Queueable;

    public function __construct(public Announcement $announcement) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("🏆 {$this->announcement->title}")
            ->greeting("Halo, {$notifiable->name}!")
            ->line($this->announcement->content)
            ->action('Lihat Hasil Lengkap', route('user.results.index'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'         => 'winner_announced',
            'announcement' => $this->announcement->title,
            'event'        => $this->announcement->event->title,
            'message'      => $this->announcement->content,
        ];
    }
}