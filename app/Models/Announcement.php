<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'event_id', 'title', 'content', 'type', 'is_published',
        'published_at', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    // Relationships
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scope: hanya yang sudah dipublish
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->whereNotNull('published_at');
    }

    // Scope: filter berdasarkan tipe
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // Publish pengumuman
    public function publish(): void
    {
        $this->update([
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    // Unpublish pengumuman
    public function unpublish(): void
    {
        $this->update([
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    // Label warna berdasarkan tipe (untuk frontend)
    public function getTypeLabelAttribute(): array
    {
        return match($this->type) {
            'winner'  => ['label' => 'Pemenang',    'color' => 'yellow'],
            'update'  => ['label' => 'Update',      'color' => 'blue'],
            'warning' => ['label' => 'Peringatan',  'color' => 'red'],
            default   => ['label' => 'Informasi',   'color' => 'gray'],
        };
    }
}