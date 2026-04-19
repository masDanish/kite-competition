<?php
namespace App\Notifications;

use App\Models\EventRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class RegistrationApproved extends Notification
{
    use Queueable;

    public function __construct(public EventRegistration $registration) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('✅ Pendaftaran Anda Disetujui!')
            ->greeting("Halo, {$notifiable->name}!")
            ->line("Pendaftaran Anda untuk event **{$this->registration->event->title}**
                    (Kategori: {$this->registration->category->name}) telah **disetujui**.")
            ->action('Upload Karya Sekarang', route('user.submissions.create',
                $this->registration->id))
            ->line('Silakan upload karya desain layangan Anda sebelum batas waktu.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'         => 'registration_approved',
            'event_title'  => $this->registration->event->title,
            'category'     => $this->registration->category->name,
            'message'      => 'Pendaftaran Anda telah disetujui. Silakan upload karya Anda.',
        ];
    }
}