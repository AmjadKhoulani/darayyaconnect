<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InfrastructureLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'serial_number',
        'coordinates',
        'status',
        'meta',
        'is_published'
    ];

    protected $casts = [
        'coordinates' => 'array',
        'meta' => 'array',
        'is_published' => 'boolean'
    ];
}
