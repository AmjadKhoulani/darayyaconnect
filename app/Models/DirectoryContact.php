<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectoryContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'category',
        'phone',
        'rating',
        'location',
        'status',
        'user_id', // New
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
