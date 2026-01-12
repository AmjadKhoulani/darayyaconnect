<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_type', // electricity, water
        'log_date',
        'status',       // available, cut_off
        'arrival_time',
        'departure_time',
        'quality',      // good, weak, bad
        'notes',
        'duration_hours',
        'neighborhood',
        'department_id'
    ];

    protected $casts = [
        'log_date' => 'date',
        'arrival_time' => 'datetime:H:i',
        'departure_time' => 'datetime:H:i',
        'duration_hours' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
