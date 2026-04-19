<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'rules', 'poster', 'location',
        'registration_start', 'registration_end', 'event_start', 'event_end',
        'max_participants', 'status', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'registration_start' => 'date',
            'registration_end' => 'date',
            'event_start' => 'date',
            'event_end' => 'date',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($event) {
            $event->slug = Str::slug($event->title);
        });
    }

    // Relationships
    public function creator() { return $this->belongsTo(User::class, 'created_by'); }
    public function categories() { return $this->hasMany(Category::class); }
    public function registrations() { return $this->hasMany(EventRegistration::class); }
    public function criteria() { return $this->hasMany(ScoringCriteria::class); }
    public function juryAssignments() { return $this->hasMany(JuryAssignment::class); }
    public function announcements() { return $this->hasMany(Announcement::class); }

    // Helpers
    public function isOpen(): bool { return $this->status === 'open'; }
    public function isRegistrationOpen(): bool
    {
        return $this->status === 'open'
            && now()->between($this->registration_start, $this->registration_end);
    }
}