<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'registration_id', 'user_id', 'title', 'description',
        'design_file', 'photo_url', 'video_url', 'status', 'submitted_at',
    ];

    public function registration() { return $this->belongsTo(EventRegistration::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function scores() { return $this->hasMany(Score::class); }

    // Hitung total skor berbobot
    public function getTotalScoreAttribute(): float
    {
        return $this->scores->sum(function ($score) {
            return $score->score * $score->criteria->weight;
        });
    }

    // Rata-rata skor per kriteria dari semua juri
    public function getAverageScoreAttribute(): float
    {
        if ($this->scores->isEmpty()) return 0;
        $total = $this->scores->sum('score');
        return round($total / $this->scores->count(), 2);
    }
}