<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventRegistration;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $registrations = EventRegistration::with(['user', 'event', 'category'])
            ->when($request->event_id, fn($q) => $q->where('event_id', $request->event_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Registrations/Index', [
            'registrations' => $registrations,
            'events' => Event::select('id', 'title')->get(),
            'filters' => $request->only(['event_id', 'status']),
        ]);
    }

    public function approve(EventRegistration $registration)
    {
        $registration->approve();
        // Kirim notifikasi ke user
        $registration->user->notify(new \App\Notifications\RegistrationApproved($registration));

        return back()->with('success', 'Pendaftaran disetujui.');
    }

    public function reject(Request $request, EventRegistration $registration)
    {
        $request->validate(['reason' => 'required|string']);
        $registration->reject($request->reason);

        return back()->with('success', 'Pendaftaran ditolak.');
    }
}