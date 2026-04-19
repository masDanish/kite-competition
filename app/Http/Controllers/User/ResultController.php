<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Submission;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index()
    {
        // Registrasi user yang eventnya sudah selesai
        $myResults = EventRegistration::with(['event', 'category', 'submission.scores.criteria'])
            ->where('user_id', Auth::id())
            ->whereHas('event', fn($q) => $q->where('status', 'finished'))
            ->get()
            ->map(function ($reg) {
                $submission  = $reg->submission;
                $finalScore  = $submission ? $submission->average_score : null;

                // Hitung ranking dalam kategori yang sama
                $rank = null;
                if ($submission && $finalScore !== null) {
                    $rank = Submission::whereHas('registration', fn($q) =>
                            $q->where('event_id', $reg->event_id)
                              ->where('category_id', $reg->category_id)
                              ->where('status', 'approved'))
                        ->where('status', 'approved')
                        ->get()
                        ->map(fn($s) => $s->average_score)
                        ->sortDesc()
                        ->values()
                        ->search($finalScore) + 1;
                }

                return [
                    'registration' => $reg,
                    'submission'   => $submission,
                    'final_score'  => $finalScore,
                    'rank'         => $rank,
                ];
            });

        return Inertia::render('User/Results/Index', [
            'results' => $myResults,
        ]);
    }

    public function show(Event $event)
    {
        // Leaderboard publik untuk event yang sudah selesai
        abort_if($event->status !== 'finished', 404, 'Hasil belum tersedia.');

        $criteria = $event->criteria;

        $leaderboard = Submission::whereHas('registration', fn($q) =>
                $q->where('event_id', $event->id)->where('status', 'approved'))
            ->where('status', 'approved')
            ->with(['user', 'registration.category', 'scores.criteria'])
            ->get()
            ->map(fn($s) => [
                'id'          => $s->id,
                'title'       => $s->title,
                'user'        => ['name' => $s->user->name],
                'category'    => $s->registration->category,
                'final_score' => $s->average_score,
                'photo_url'   => $s->photo_url,
            ])
            ->sortByDesc('final_score')
            ->values();

        return Inertia::render('User/Results/Show', [
            'event'       => $event,
            'leaderboard' => $leaderboard,
            'criteria'    => $criteria,
        ]);
    }
}