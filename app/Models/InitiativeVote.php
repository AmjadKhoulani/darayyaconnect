<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InitiativeVote extends Model
{
    protected $fillable = ['initiative_id', 'user_id'];

    public function initiative()
    {
        return $this->belongsTo(Initiative::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
