<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $fillable = ['submission_id', 'jury_id', 'criteria_id', 'score', 'comment'];

    public function submission() { return $this->belongsTo(Submission::class); }
    public function jury() { return $this->belongsTo(User::class, 'jury_id'); }
    public function criteria() { return $this->belongsTo(ScoringCriteria::class, 'criteria_id'); }
}