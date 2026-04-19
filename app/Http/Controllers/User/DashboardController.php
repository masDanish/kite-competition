<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $registrations = EventRegistration::with(['event', 'category', 'submission'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        $announcements = Announcement::with('event')
            ->published()
            ->latest('published_at')
            ->take(5)
            ->get();

        return Inertia::render('User/Dashboard', [
            'registrations' => $registrations,
            'announcements' => $announcements,
        ]);
    }
}