<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatChannel extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'icon'];

    public function settings()
    {
        return $this->hasMany(UserChannelSetting::class, 'channel_id');
    }
}
