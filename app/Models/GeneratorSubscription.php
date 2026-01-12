<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneratorSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'generator_id',
        'notify_price_change',
        'notify_issues',
    ];

    protected $casts = [
        'notify_price_change' => 'boolean',
        'notify_issues' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function generator()
    {
        return $this->belongsTo(Generator::class);
    }
}
