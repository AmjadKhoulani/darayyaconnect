<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneratorRating extends Model
{
    use HasFactory;

    protected $fillable = [
        'generator_id',
        'user_id',
        'overall_rating',
        'service_quality',
        'punctuality',
        'power_stability',
        'customer_service',
        'comment',
        'is_anonymous',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
    ];

    protected $hidden = ['user_id']; // Always hide user_id for anonymity

    public function generator()
    {
        return $this->belongsTo(Generator::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
