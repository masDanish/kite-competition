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

        // FILTER STATUS
        ->when($request->status, fn($q) =>
            $q->where('status', $request->status)
        )

        ->when($request->search, fn($q) =>
            $q->where('title', 'like', "%{$request->search}%"))

        ->withCount('registrations')

        ->orderByRaw("FIELD(status, 'open', 'ongoing', 'closed', 'finished')")
        ->paginate(9)
        ->withQueryString();

    return Inertia::render('User/Events/Index', [
        'events'  => $events,
        'filters' => $request->only(['search', 'status']),
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