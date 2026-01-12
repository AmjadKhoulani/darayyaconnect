<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = [
        'user_id',
        'votable_id',
        'votable_type',
        'option_id',
        'value',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function votable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
