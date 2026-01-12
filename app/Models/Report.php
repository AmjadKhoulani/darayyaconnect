<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'description',
        'infrastructure_point_id',
        'latitude',
        'longitude',
        'photo_url',
        'status',
        'is_anonymous',
        'department_id',
        'department_assigned',
        'user_id'
    ];

    public function infrastructurePoint()
    {
        return $this->belongsTo(InfrastructurePoint::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
