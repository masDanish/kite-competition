<?php
namespace App\Http\Controllers\Jury;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Score;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $juryId = Auth::id();

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $assignments = $user->juryAssignments()
            ->with(['event', 'category'])
            ->where('is_active', true)
            ->get()
            ->map(function ($assignment) use ($juryId) {
                $progress = $assignment->scoring_progress;
                return array_merge($assignment->toArray(), ['progress' => $progress]);
            });

        // Total karya yang sudah dinilai bulan ini
        $scoredThisMonth = Score::where('jury_id', $juryId)
            ->whereMonth('created_at', now()->month)
            ->distinct('submission_id')
            ->count();

        // Total skor yang diberikan
        $totalScores = Score::where('jury_id', $juryId)->count();

        return Inertia::render('Jury/Dashboard', [
            'assignments'     => $assignments,
            'scoredThisMonth' => $scoredThisMonth,
            'totalScores'     => $totalScores,
        ]);
    }
}