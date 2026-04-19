<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->role, fn($q) => $q->where('role', $request->role))
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            }))
            ->withCount(['registrations', 'submissions'])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // ✅ Diperbaiki dari 'Admin/Registrations/Index' ke 'Admin/Users/Index'
        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['role', 'search']),
        ]);
    }

    public function show(User $user)
    {
        $user->load([
            'registrations.event',
            'registrations.category',
            'submissions.registration.event',
        ]);

        return Inertia::render('Admin/Users/Show', ['user' => $user]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', Rule::in(['admin', 'jury', 'user'])],
        ]);

        if ($user->id === Auth::id()) {
            return back()->with('error', 'Anda tidak dapat mengubah role diri sendiri.');
        }

        $user->update(['role' => $request->role]);
        return back()->with('success', "Role {$user->name} berhasil diubah menjadi {$request->role}.");
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        $user->delete();
        return back()->with('success', 'User berhasil dihapus.');
    }
}