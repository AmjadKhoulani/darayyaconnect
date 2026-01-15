<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category',
        'severity',
        'description',
        'location_id',
        'coordinates',
        'latitude',
        'longitude',
        'status',
        'images',
        'user_id',
        'department_id',
        'department_assigned'
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
