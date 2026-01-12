<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'type',
        'author_name',
        'role',
        'image_url',
        'likes_count',
        'comments_count',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function votes()
    {
        return $this->morphMany(Vote::class, 'votable');
    }
}
