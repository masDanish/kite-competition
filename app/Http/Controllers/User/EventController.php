<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
{
    $events = Event::with(['categories'])
        ->where('status', '!=', 'draft')
        ->when($request->search, fn($q) =>
            $q->where('title', 'like', "%{$request->search}%"))
        ->withCount('registrations')
        ->orderByRaw("FIELD(status, 'open', 'ongoing', 'closed', 'finished')")
        ->paginate(9)
        ->withQueryString();

    // Ambil semua event_id yang sudah didaftarkan user ini
    $myRegistrations = \App\Models\EventRegistration::where('user_id', Auth::id())
        ->pluck('status', 'event_id'); // [event_id => status]

    return Inertia::render('User/Events/Index', [
        'events'          => $events,
        'filters'         => $request->only(['search']),
        'myRegistrations' => $myRegistrations, // kirim ke frontend
    ]);
}

    public function show(Event $event)
    {
        $event->load(['categories', 'criteria', 'announcements' => fn($q) => $q->published()]);

        $myRegistration = null;
        if (Auth::check()) {
            $myRegistration = $event->registrations()
                ->where('user_id', Auth::id())
                ->with('submission')
                ->first();
        }

        return Inertia::render('User/Events/Show', [
            'event'          => $event,
            'myRegistration' => $myRegistration,
        ]);
    }
}