<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InfrastructureLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'coordinates',
        'status',
        'meta'
    ];

    protected $casts = [
        'coordinates' => 'array',
        'meta' => 'array'
    ];
}
