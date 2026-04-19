<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use App\Models\EventRegistration;
use App\Models\Submission;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'events'      => Event::count(),
            'users'       => User::where('role', 'user')->count(),
            'jury'        => User::where('role', 'jury')->count(),
            'pending'     => EventRegistration::where('status', 'pending')->count(),
            'submissions' => Submission::where('status', 'submitted')->count(),
            'approved'    => EventRegistration::where('status', 'approved')->count(),
        ];

        $recentEvents = Event::with('creator')
            ->withCount('registrations')
            ->latest()
            ->take(5)
            ->get();

        $pendingRegistrations = EventRegistration::with(['user', 'event', 'category'])
            ->where('status', 'pending')
            ->latest()
            ->take(10)
            ->get();

        $recentSubmissions = Submission::with(['user', 'registration.event'])
            ->where('status', 'submitted')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats'                => $stats,
            'recentEvents'         => $recentEvents,
            'pendingRegistrations' => $pendingRegistrations,
            'recentSubmissions'    => $recentSubmissions,
        ]);
    }
}