<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\EventRegistration;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function create(EventRegistration $registration)
{
    // Ganti $this->authorize() dengan pengecekan manual
    if ($registration->user_id !== Auth::id()) {
        abort(403, 'Ini bukan pendaftaran Anda.');
    }

    if ($registration->status !== 'approved') {
        abort(403, 'Pendaftaran belum disetujui.');
    }

    if ($registration->submission !== null) {
        return redirect()->route('user.registrations.index')
            ->with('info', 'Anda sudah mengupload karya untuk pendaftaran ini.');
    }

    return Inertia::render('User/Submissions/Create', [
        'registration' => $registration->load(['event', 'category']),
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_id' => 'required|exists:event_registrations,id',
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'design_file'     => 'nullable|file|mimes:pdf,jpg,png|max:5120',
            'photo_url'       => 'nullable|image|max:3072',
            'video_url'       => 'nullable|url',
        ]);

        if ($request->hasFile('design_file')) {
            $validated['design_file'] = $request->file('design_file')
                ->store('designs', 'public');
        }

        if ($request->hasFile('photo_url')) {
            $validated['photo_url'] = $request->file('photo_url')
                ->store('photos', 'public');
        }

        Submission::create([
            ...$validated,
            'user_id'      => Auth::id(),
            'status'       => 'submitted',
            'submitted_at' => now(),
        ]);

        return redirect()->route('user.dashboard')
            ->with('success', 'Karya berhasil diupload!');
    }
}