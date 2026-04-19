<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    protected $fillable = [
        'user_id', 'event_id', 'category_id', 'team_name',
        'participant_count', 'notes', 'status', 'rejection_reason', 'approved_at',
    ];

    protected function casts(): array
    {
        return ['approved_at' => 'datetime'];
    }

    public function user() { return $this->belongsTo(User::class); }
    public function event() { return $this->belongsTo(Event::class); }
    public function category() { return $this->belongsTo(Category::class); }
    public function submission() { return $this->hasOne(Submission::class, 'registration_id'); }

    public function approve(): void
    {
        $this->update(['status' => 'approved', 'approved_at' => now()]);
    }

    public function reject(string $reason): void
    {
        $this->update(['status' => 'rejected', 'rejection_reason' => $reason]);
    }
}