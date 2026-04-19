<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index()
    {
        $registrations = EventRegistration::with([
                'event',
                'category'
            ])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('User/Registrations/Index', [
            'registrations' => $registrations
        ]);
    }

    public function create(Event $event)
    {
        // Cek apakah sudah terdaftar
        $existing = EventRegistration::where('user_id', Auth::id())
            ->where('event_id', $event->id)
            ->first();

        if ($existing) {
            return redirect()
                ->route('user.registrations.index')
                ->with('info', 'Anda sudah mendaftar di event ini.');
        }

        return Inertia::render('User/Registrations/Create', [
            'event' => $event->load('categories'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id'    => 'required|exists:events,id',
            'category_id' => 'required|exists:categories,id',
            'team_name'   => 'nullable|string|max:255',
            'notes'       => 'nullable|string',
        ]);

        $event = Event::findOrFail($validated['event_id']);

        if (!$event->isRegistrationOpen()) {
            return back()->with('error', 'Pendaftaran untuk event ini sudah ditutup.');
        }

        EventRegistration::create([
            ...$validated,
            'user_id' => Auth::id(),
            'status'  => 'pending',
        ]);

        return redirect()
            ->route('user.registrations.index')
            ->with('success', 'Pendaftaran berhasil! Silakan tunggu persetujuan admin.');
    }
}