<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\EventRegistration;
use App\Models\ScoringCriteria;
use App\Models\Submission;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $registrations = EventRegistration::with(['event', 'category', 'submission'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        $announcements = Announcement::with(['event'])
            ->where('is_published', true)
            ->latest('published_at')
            ->get()
            ->map(function ($ann) {
                if ($ann->type === 'winner') {

                    // Ambil semua kriteria untuk event ini beserta bobotnya
                    $criteriaList = ScoringCriteria::where('event_id', $ann->event_id)->get();

                    // Jumlah total bobot (untuk weighted average)
                    $totalWeight = $criteriaList->sum('weight') ?: 1;

                    $ann->leaderboard = Submission::with([
                            'registration.user',
                            'registration.category',
                            'scores', // relasi ke tabel scores
                        ])
                        ->whereHas('registration', fn($q) =>
                            $q->where('event_id', $ann->event_id)
                              ->where('status', 'approved')
                        )
                        ->get()
                        ->map(function ($submission) use ($criteriaList, $totalWeight) {

                            // Hitung rata-rata per kriteria dari semua juri,
                            // lalu kalikan bobot masing-masing kriteria
                            $weightedTotal = 0;

                            foreach ($criteriaList as $criteria) {
                                // Semua score dari semua juri untuk kriteria ini
                                $scoresForCriteria = $submission->scores
                                    ->where('criteria_id', $criteria->id);

                                if ($scoresForCriteria->isEmpty()) continue;

                                // Rata-rata nilai juri untuk kriteria ini
                                $avgScore = $scoresForCriteria->avg('score');

                                // Kalikan dengan bobot kriteria
                                $weightedTotal += $avgScore * $criteria->weight;
                            }

                            // Final score = total weighted / total bobot
                            $finalScore = $totalWeight > 0
                                ? round($weightedTotal / $totalWeight, 2)
                                : 0;

                            return [
                                'user_name'   => $submission->registration->user->name,
                                'category'    => $submission->registration->category->name ?? '-',
                                'title'       => $submission->title,
                                'final_score' => $finalScore,
                            ];
                        })
                        // Urutkan dari skor tertinggi
                        ->sortByDesc('final_score')
                        ->values()
                        ->take(5);
                }

                return $ann;
            });

        return Inertia::render('User/Dashboard', [
            'registrations' => $registrations,
            'announcements' => $announcements,
        ]);
    }
}