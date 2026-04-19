<?php
namespace App\Policies;

use App\Models\Submission;
use App\Models\User;

class ScorePolicy
{
    // Juri hanya bisa menilai submission dari event yang ditugaskan
    public function score(User $user, Submission $submission): bool
    {
        if (!$user->isJury()) return false;

        $eventId = $submission->registration->event_id;

        return $user->juryAssignments()
            ->where('event_id', $eventId)
            ->where('is_active', true)
            ->exists();
    }
}