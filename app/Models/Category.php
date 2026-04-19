<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'event_id', 'name', 'description', 'max_participants',
    ];

    // Relationships
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function juryAssignments()
    {
        return $this->hasMany(JuryAssignment::class);
    }

    // Helpers
    public function getRemainingSlotAttribute(): ?int
    {
        if (is_null($this->max_participants)) return null;
        $taken = $this->registrations()->where('status', 'approved')->count();
        return max(0, $this->max_participants - $taken);
    }

    public function isFull(): bool
    {
        if (is_null($this->max_participants)) return false;
        return $this->registrations()->where('status', 'approved')->count() >= $this->max_participants;
    }
}