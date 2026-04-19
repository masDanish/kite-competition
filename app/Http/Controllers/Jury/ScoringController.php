<?php
namespace App\Http\Controllers\Jury;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Score;
use App\Models\Event;
use App\Models\ScoringCriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class ScoringController extends Controller
{
    public function index()
    {
        $juryId = Auth::id();
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $assignments = $user->juryAssignments()
            ->with(['event', 'category'])
            ->where('is_active', true)
            ->get();

        return Inertia::render('Jury/Scoring/Index', [
            'assignments' => $assignments,
        ]);
    }

    public function show(Event $event)
    {
        $juryId = Auth::id();
        $criteria = $event->criteria;

        $submissions = Submission::whereHas('registration', function ($q) use ($event) {
            $q->where('event_id', $event->id)->where('status', 'approved');
        })
        ->with(['registration.user', 'registration.category'])
        ->withCount(['scores as my_scores_count' => function ($q) use ($juryId) {
            $q->where('jury_id', $juryId);
        }])
        ->get();

        return Inertia::render('Jury/Scoring/Show', [
            'event' => $event,
            'submissions' => $submissions,
            'criteria' => $criteria,
        ]);
    }

    public function score(Request $request, Submission $submission)
    {
        $request->validate([
            'scores'             => 'required|array',
            'scores.*.criteria_id' => 'required|exists:scoring_criteria,id',
            'scores.*.score'     => 'required|numeric|min:0',
            'scores.*.comment'   => 'nullable|string|max:500',
        ]);

        foreach ($request->scores as $s) {
            Score::updateOrCreate(
                [
                    'submission_id' => $submission->id,
                    'jury_id'       => Auth::id(),
                    'criteria_id'   => $s['criteria_id'],
                ],
                [
                    'score'   => min($s['score'], ScoringCriteria::find($s['criteria_id'])->max_score),
                    'comment' => $s['comment'] ?? null,
                ]
            );
        }

        return back()->with('success', 'Penilaian berhasil disimpan!');
    }
}