<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Initiative extends Model
{
    protected $fillable = [
        'user_id', 'title', 'description', 'image', 'status', 'votes_count', 'moderation_status', 'rejection_reason'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->hasMany(InitiativeVote::class);
    }
}
