<?php
namespace App\Notifications;

use App\Models\EventRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class RegistrationRejected extends Notification
{
    use Queueable;

    public function __construct(
        public EventRegistration $registration,
        public string $reason
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('❌ Pendaftaran Anda Ditolak')
            ->greeting("Halo, {$notifiable->name}.")
            ->line("Pendaftaran untuk event **{$this->registration->event->title}** tidak dapat disetujui.")
            ->line("Alasan: {$this->reason}")
            ->line('Jika ada pertanyaan, silakan hubungi panitia.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'        => 'registration_rejected',
            'event_title' => $this->registration->event->title,
            'reason'      => $this->reason,
            'message'     => 'Pendaftaran Anda ditolak. Lihat detail untuk alasannya.',
        ];
    }
}