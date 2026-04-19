<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::with(['event', 'author'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Announcements/Create', [
            'events' => Event::select('id', 'title')->where('status', '!=', 'draft')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id'     => 'required|exists:events,id',
            'title'        => 'required|string|max:255',
            'content'      => 'required|string',
            'type'         => 'required|in:info,winner,update,warning',
            'is_published' => 'boolean',
        ]);

        $validated['created_by'] = Auth::id();

        if ($validated['is_published'] ?? false) {
            $validated['published_at'] = now();
        }

        Announcement::create($validated);

        return redirect()->route('admin.announcements.index')
            ->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('Admin/Announcements/Edit', [
            'announcement' => $announcement->load('event'),
            'events'       => Event::select('id', 'title')->get(),
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string',
            'type'         => 'required|in:info,winner,update,warning',
            'is_published' => 'boolean',
        ]);

        if (($validated['is_published'] ?? false) && !$announcement->is_published) {
            $validated['published_at'] = now();
        } elseif (!($validated['is_published'] ?? false)) {
            $validated['published_at'] = null;
        }

        $announcement->update($validated);
        return redirect()->route('admin.announcements.index')
            ->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return back()->with('success', 'Pengumuman berhasil dihapus.');
    }

    public function publish(Announcement $announcement)
    {
        $announcement->publish();
        return back()->with('success', 'Pengumuman berhasil dipublikasikan.');
    }

    public function unpublish(Announcement $announcement)
    {
        $announcement->unpublish();
        return back()->with('success', 'Pengumuman berhasil disembunyikan.');
    }
}