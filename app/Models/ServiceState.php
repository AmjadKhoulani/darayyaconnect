<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceState extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_key',
        'name',
        'status_text',
        'status_color',
        'icon',
        'is_active',
        'last_updated_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_updated_at' => 'datetime',
    ];
}
