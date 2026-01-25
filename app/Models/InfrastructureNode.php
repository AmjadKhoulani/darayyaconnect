<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InfrastructureNode extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'latitude',
        'longitude',
        'status',
        'meta',
        'is_published'
    ];

    protected $casts = [
        'meta' => 'array'
    ];
}
