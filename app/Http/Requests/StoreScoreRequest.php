<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreScoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return $user->isJury();
    }

    public function rules(): array
    {
        return [
            'scores'               => 'required|array|min:1',
            'scores.*.criteria_id' => 'required|exists:scoring_criteria,id',
            'scores.*.score'       => 'required|numeric|min:0',
            'scores.*.comment'     => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'scores.required'               => 'Data penilaian tidak boleh kosong.',
            'scores.*.criteria_id.required' => 'ID kriteria wajib ada.',
            'scores.*.score.required'       => 'Nilai wajib diisi untuk setiap kriteria.',
            'scores.*.score.min'            => 'Nilai tidak boleh negatif.',
        ];
    }
}