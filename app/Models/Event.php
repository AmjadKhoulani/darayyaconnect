<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'location_name',
        'department_id'
    ];
    
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime'
    ];
    
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    
    public function attendees()
    {
        return $this->hasMany(EventAttendee::class);
    }
    
    public function getIsAttendingAttribute()
    {
        if (!Auth::check()) return false;
        return $this->attendees()->where('user_id', Auth::id())->exists();
    }
}
