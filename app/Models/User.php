<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\EventRegistration;
use App\Models\Submission;
use App\Models\JuryAssignment;
use App\Models\Score;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone', 'address', 'avatar',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Role helpers
    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isJury(): bool { return $this->role === 'jury'; }
    public function isUser(): bool { return $this->role === 'user'; }

    // Relationships
    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function juryAssignments()
    {
        return $this->hasMany(JuryAssignment::class);
    }

    public function scores()
    {
        return $this->hasMany(Score::class, 'jury_id');
    }
}