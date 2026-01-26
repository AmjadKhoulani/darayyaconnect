<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserChannelSetting extends Model
{
    protected $fillable = ['user_id', 'channel_id', 'is_muted'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function channel()
    {
        return $this->belongsTo(ChatChannel::class);
    }
}
