<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScoringCriteria extends Model
{
    protected $table = 'scoring_criteria';

    protected $fillable = [
        'event_id', 'name', 'description', 'max_score', 'weight',
    ];

    protected function casts(): array
    {
        return [
            'max_score' => 'integer',
            'weight'    => 'float',
        ];
    }

    // Relationships
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function scores()
    {
        return $this->hasMany(Score::class, 'criteria_id');
    }

    // Rata-rata nilai untuk kriteria ini di seluruh submission
    public function getAverageScoreAttribute(): float
    {
        if ($this->scores->isEmpty()) return 0;
        return round($this->scores->avg('score'), 2);
    }
}