<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Category;
use App\Models\ScoringCriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with(['creator', 'categories'])
            ->withCount('registrations')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'              => 'required|string|max:255',
            'description'        => 'required|string',
            'rules'              => 'nullable|string',
            'location'           => 'nullable|string',
            'registration_start' => 'required|date',
            'registration_end'   => 'required|date|after:registration_start',
            'event_start'        => 'required|date|after_or_equal:registration_end',
            'event_end'          => 'required|date|after:event_start',
            'max_participants'   => 'nullable|integer|min:1',
            'poster'             => 'nullable|image|max:2048',
            'categories'         => 'required|array|min:1',
            'categories.*.name'  => 'required|string',
            'criteria'           => 'required|array|min:1',
            'criteria.*.name'    => 'required|string',
            'criteria.*.max_score' => 'required|integer|min:1|max:100',
            'criteria.*.weight'  => 'required|numeric|min:0.1',
        ]);

        if ($request->hasFile('poster')) {
            $validated['poster'] = $request->file('poster')->store('posters', 'public');
        }

        $validated['created_by'] = Auth::id();
        $event = Event::create($validated);

        foreach ($validated['categories'] as $cat) {
            $event->categories()->create($cat);
        }

        foreach ($validated['criteria'] as $criterion) {
            $event->criteria()->create($criterion);
        }

        return redirect()->route('admin.events.index')
            ->with('success', 'Event berhasil dibuat!');
    }

    public function edit(Event $event)
    {
        $event->load(['categories', 'criteria']);
        return Inertia::render('Admin/Events/Edit', ['event' => $event]);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'status'      => 'required|in:draft,open,closed,ongoing,finished',
        ]);

        $event->update($validated);
        return redirect()->route('admin.events.index')
            ->with('success', 'Event berhasil diperbarui!');
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('admin.events.index')
            ->with('success', 'Event berhasil dihapus.');
    }
}