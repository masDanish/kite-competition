<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class JuryAssignment extends Model
{
    protected $fillable = [
        'user_id', 'event_id', 'category_id', 'is_active', 'assigned_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active'   => 'boolean',
            'assigned_at' => 'datetime',
        ];
    }

    // Relationships
    public function jury()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Hitung progres penilaian oleh juri ini di event ini
    public function getScoringProgressAttribute(): array
    {
        $juryId  = $this->user_id;
        $eventId = $this->event_id;

        $totalSubmissions = Submission::whereHas('registration', function ($q) use ($eventId) {
            $q->where('event_id', $eventId)->where('status', 'approved');
        })->count();

        $criteriaCount = ScoringCriteria::where('event_id', $eventId)->count();

        $scoredCount = Score::where('jury_id', $juryId)
            ->whereHas('submission.registration', function ($q) use ($eventId) {
                $q->where('event_id', $eventId);
            })
            ->distinct('submission_id')
            ->count();

        $totalRequired = $totalSubmissions * $criteriaCount;
        $totalScored   = Score::where('jury_id', $juryId)
            ->whereHas('submission.registration', function ($q) use ($eventId) {
                $q->where('event_id', $eventId);
            })->count();

        return [
            'total_submissions'  => $totalSubmissions,
            'scored_submissions' => $scoredCount,
            'total_scores'       => $totalRequired,
            'given_scores'       => $totalScored,
            'percentage'         => $totalRequired > 0
                ? round(($totalScored / $totalRequired) * 100, 1)
                : 0,
            'is_complete'        => $totalRequired > 0 && $totalScored >= $totalRequired,
        ];
    }
}