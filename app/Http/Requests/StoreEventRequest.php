<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return $user->isAdmin();
    }

    public function rules(): array
    {
        return [
            'title'                     => 'required|string|max:255',
            'description'               => 'required|string',
            'rules'                     => 'nullable|string',
            'location'                  => 'nullable|string|max:255',
            'registration_start'        => 'required|date|after_or_equal:today',
            'registration_end'          => 'required|date|after:registration_start',
            'event_start'               => 'required|date|after_or_equal:registration_end',
            'event_end'                 => 'required|date|after:event_start',
            'max_participants'          => 'nullable|integer|min:1',
            'poster'                    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'categories'                => 'required|array|min:1',
            'categories.*.name'         => 'required|string|max:255',
            'categories.*.description'  => 'nullable|string',
            'categories.*.max_participants' => 'nullable|integer|min:1',
            'criteria'                  => 'required|array|min:1',
            'criteria.*.name'           => 'required|string|max:255',
            'criteria.*.description'    => 'nullable|string',
            'criteria.*.max_score'      => 'required|integer|min:1|max:100',
            'criteria.*.weight'         => 'required|numeric|min:0.1|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'                => 'Judul event wajib diisi.',
            'registration_start.after_or_equal' => 'Pendaftaran tidak boleh dimulai di masa lalu.',
            'registration_end.after'        => 'Tutup pendaftaran harus setelah mulai pendaftaran.',
            'event_start.after_or_equal'    => 'Event harus dimulai setelah pendaftaran tutup.',
            'categories.required'           => 'Minimal 1 kategori harus ditambahkan.',
            'criteria.required'             => 'Minimal 1 kriteria penilaian harus ditambahkan.',
            'criteria.*.max_score.max'      => 'Nilai maksimal tidak boleh lebih dari 100.',
        ];
    }
}