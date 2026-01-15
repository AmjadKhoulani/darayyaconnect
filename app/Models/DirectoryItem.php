<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'icon',
        'type',
        'category',
        'description',
        'rating',
        'metadata',
        'is_active',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
        'rating' => 'float',
    ];
}
