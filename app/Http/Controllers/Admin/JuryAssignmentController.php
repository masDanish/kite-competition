<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\JuryAssignment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JuryAssignmentController extends Controller
{
    public function index(Event $event)
    {
        $event->load(['categories', 'juryAssignments.jury', 'juryAssignments.category']);
        $availableJury = User::where('role', 'jury')->get();

        return Inertia::render('Admin/JuryAssignments/Index', [
            'event'         => $event,
            'availableJury' => $availableJury,
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        // Pastikan user adalah juri
        $user = User::findOrFail($validated['user_id']);
        if (!$user->isJury()) {
            return back()->with('error', 'User yang dipilih bukan juri.');
        }

        JuryAssignment::firstOrCreate([
            'user_id'     => $validated['user_id'],
            'event_id'    => $event->id,
            'category_id' => $validated['category_id'] ?? null,
        ], [
            'is_active'   => true,
            'assigned_at' => now(),
        ]);

        return back()->with('success', "{$user->name} berhasil ditugaskan sebagai juri.");
    }

    public function destroy(JuryAssignment $assignment)
    {
        $assignment->delete();
        return back()->with('success', 'Penugasan juri berhasil dihapus.');
    }

    public function toggle(JuryAssignment $assignment)
    {
        $assignment->update(['is_active' => !$assignment->is_active]);
        $status = $assignment->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Juri berhasil {$status}.");
    }
}