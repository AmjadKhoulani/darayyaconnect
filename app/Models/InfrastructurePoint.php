<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InfrastructurePoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'latitude',
        'longitude',
        'geometry', // New
        'height',   // New
        'status',
        'condition', 
        'category',
        'responsible_entity',
        'metadata',
        'last_updated_at',
        'last_maintenance_date', 
        'images_before', 
        'images_after', 
        'infrastructure_point_id' 
    ];

    protected $casts = [
        'metadata' => 'array',
        'geometry' => 'array', // New
        'images_before' => 'array',
        'images_after' => 'array',
        'last_updated_at' => 'datetime',
        'last_maintenance_date' => 'date',
    ];

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
