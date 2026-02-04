<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolunteerTeam extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'city_id',
        'name',
        'description',
        'logo',
        'status', // pending, approved, rejected
        'contact_info',
        'meta'
    ];

    protected $casts = [
        'contact_info' => 'array',
        'meta' => 'array'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function opportunities()
    {
        return $this->hasMany(VolunteerOpportunity::class);
    }
}
