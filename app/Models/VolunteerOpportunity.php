<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolunteerOpportunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'role_type',
        'location',
        'time_commitment',
        'status'
    ];

    public function applications()
    {
        return $this->hasMany(VolunteerApplication::class, 'opportunity_id');
    }
}
