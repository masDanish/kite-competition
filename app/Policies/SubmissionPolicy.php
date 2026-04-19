<?php
namespace App\Policies;

use App\Models\EventRegistration;
use App\Models\User;

class SubmissionPolicy
{
    // Hanya pemilik registrasi yang approved boleh upload
    public function upload(User $user, EventRegistration $registration): bool
    {
        return $registration->user_id === $user->id
            && $registration->status === 'approved'
            && $registration->submission === null;
    }

    // Hanya pemilik yang boleh edit submission (selama belum dinilai)
    public function update(User $user, \App\Models\Submission $submission): bool
    {
        return $submission->user_id === $user->id
            && $submission->scores()->count() === 0;
    }
}