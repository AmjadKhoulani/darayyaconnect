<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SosAlert extends Model
{
    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'current_latitude',
        'current_longitude',
        'status',
        'message',
        'emergency_type',
        'resolved_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
