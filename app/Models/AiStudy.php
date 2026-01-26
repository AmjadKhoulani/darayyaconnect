<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiStudy extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'scenario' => 'array',
        'economics' => 'array',
        'environmental' => 'array',
        'social' => 'array',
        'implementation' => 'array',
        'risks' => 'array',
        'recommendations' => 'array',
        'technical_details' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];
}
