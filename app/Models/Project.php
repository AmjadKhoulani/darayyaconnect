<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'progress',
        'votes_count',
        'score',
        'infrastructure_point_id',
        'image_url',
    ];

    public function infrastructurePoint()
    {
        return $this->belongsTo(InfrastructurePoint::class);
    }

    public function votes()
    {
        return $this->morphMany(Vote::class, 'votable');
    }
}
