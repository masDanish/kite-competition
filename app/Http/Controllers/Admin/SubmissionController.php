<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index(Request $request)
    {
        $submissions = Submission::with(['user', 'registration.event', 'registration.category'])
            ->when($request->event_id, fn($q) => $q->whereHas('registration',
                fn($r) => $r->where('event_id', $request->event_id)))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->withCount('scores')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Submissions/Index', [
            'submissions' => $submissions,
            'events'      => Event::select('id', 'title')->get(),
            'filters'     => $request->only(['event_id', 'status']),
        ]);
    }

    public function show(Submission $submission)
    {
        $submission->load([
            'user',
            'registration.event',
            'registration.category',
            'scores.jury',
            'scores.criteria',
        ]);

        return Inertia::render('Admin/Submissions/Show', [
            'submission' => $submission,
        ]);
    }

    public function approve(Submission $submission)
    {
        $submission->update(['status' => 'approved']);
        return back()->with('success', 'Karya berhasil disetujui.');
    }

    public function reject(Request $request, Submission $submission)
    {
        $request->validate(['reason' => 'required|string|max:500']);
        $submission->update([
            'status'           => 'rejected',
            'rejection_reason' => $request->reason,
        ]);
        return back()->with('success', 'Karya berhasil ditolak.');
    }
}