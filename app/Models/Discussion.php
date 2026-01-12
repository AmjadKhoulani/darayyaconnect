<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Discussion extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'body', 'category', 'views', 'image_path'];

    protected $appends = ['votes_count', 'replies_count', 'current_user_vote', 'image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(DiscussionReply::class);
    }

    public function votes()
    {
        return $this->hasMany(DiscussionVote::class);
    }

    public function getVotesCountAttribute()
    {
        return $this->votes()->count();
    }

    public function getRepliesCountAttribute()
    {
        return $this->replies()->count();
    }

    public function getCurrentUserVoteAttribute()
    {
        if (!Auth::check()) return null;
        return $this->votes()->where('user_id', Auth::id())->exists(); // Returns true if voted
    }
}
