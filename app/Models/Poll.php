<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Poll extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'department_id',
        'status',
        'expires_at'
    ];
    
    protected $casts = [
        'expires_at' => 'datetime'
    ];
    
    // Relationships
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    
    public function options()
    {
        return $this->hasMany(PollOption::class);
    }
    
    // Check if current user voted
    public function getHasVotedAttribute()
    {
        if (!Auth::check()) return false;
        return PollVote::where('poll_id', $this->id)
            ->where('user_id', Auth::id())
            ->exists();
    }
}
