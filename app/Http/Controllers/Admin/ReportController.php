<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Submission;
use App\Models\Score;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $events = Event::withCount(['registrations', 'juryAssignments'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'events' => $events,
        ]);
    }

    public function leaderboard(Event $event)
    {
        $criteria   = $event->criteria;
        $juryCount  = $event->juryAssignments()->where('is_active', true)->count();

        // Ambil semua submission yang sudah diapprove + load semua score-nya
        $submissions = Submission::whereHas('registration', fn($q) =>
                $q->where('event_id', $event->id)->where('status', 'approved'))
            ->where('status', 'approved')
            ->with([
                'user',
                'registration.category',
                'scores.criteria',
            ])
            ->get()
            ->map(function ($submission) use ($juryCount, $criteria) {
                // Hitung skor berbobot rata-rata per kriteria
                $totalWeighted = 0;
                $totalWeight   = 0;

                foreach ($criteria as $criterion) {
                    $criteriaScores = $submission->scores
                        ->where('criteria_id', $criterion->id);

                    if ($criteriaScores->isNotEmpty()) {
                        $avgScore       = $criteriaScores->avg('score');
                        $totalWeighted += $avgScore * $criterion->weight;
                        $totalWeight   += $criterion->weight;
                    }
                }

                $finalScore = $totalWeight > 0
                    ? round($totalWeighted / $totalWeight, 2)
                    : 0;

                return [
                    'id'           => $submission->id,
                    'title'        => $submission->title,
                    'user'         => $submission->user,
                    'category'     => $submission->registration->category,
                    'final_score'  => $finalScore,
                    'scores_given' => $submission->scores->count(),
                    'photo_url'    => $submission->photo_url,
                ];
            })
            ->sortByDesc('final_score')
            ->values();

        return Inertia::render('Admin/Reports/Leaderboard', [
            'event'       => $event->load('categories'),
            'leaderboard' => $submissions,
            'criteria'    => $criteria,
            'jury_count'  => $juryCount,
        ]);
    }

    public function exportLeaderboard(Event $event)
{
    // Export CSV sederhana
    $submissions = Submission::whereHas('registration', fn($q) =>
            $q->where('event_id', $event->id)->where('status', 'approved'))
        ->with(['user', 'registration.category', 'scores.criteria'])
        ->get();

    $csv = "Rank,Nama,Kategori,Karya,Total Skor\n";
    $rank = 1;
    foreach ($submissions as $s) {
        $csv .= "{$rank},{$s->user->name},{$s->registration->category->name},{$s->title},{$s->average_score}\n";
        $rank++;
    }

    return response($csv, 200, [
        'Content-Type'        => 'text/csv',
        'Content-Disposition' => "attachment; filename=leaderboard-{$event->slug}.csv",
    ]);
}

public function export(Event $event)
{
    return $this->exportLeaderboard($event);
}
}