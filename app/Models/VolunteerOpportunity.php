<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolunteerOpportunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'organization',
        'description',
        'role_type',
        'location',
        'time_commitment',
        'start_date',
        'end_date',
        'spots_total',
        'spots_filled',
        'image',
        'tags',
        'status',
        'moderation_status'
    ];

    protected $casts = [
        'tags' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function applications()
    {
        return $this->hasMany(VolunteerApplication::class, 'opportunity_id');
    }
}
