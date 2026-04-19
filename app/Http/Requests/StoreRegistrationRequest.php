<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\EventRegistration;
use Illuminate\Support\Facades\Auth;

class StoreRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return $user->isUser();
    }

    public function rules(): array
    {
        return [
            'event_id'    => [
                'required',
                'exists:events,id',
                function ($attribute, $value, $fail) {
                    $exists = EventRegistration::where('user_id', Auth::id())
                        ->where('event_id', $value)->exists();
                    if ($exists) {
                        $fail('Anda sudah mendaftar di event ini.');
                    }
                },
            ],
            'category_id' => 'required|exists:categories,id',
            'team_name'   => 'nullable|string|max:255',
            'notes'       => 'nullable|string|max:1000',
        ];
    }
}