<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'author',
        'category',
        'condition',
        'status',
        'cover_image',
        'contact_info',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeLanguage($query, $language)
    {
        return $query->where('language', $language);
    }

    public function requests()
    {
        return $this->hasMany(BookRequest::class);
    }

    public function currentRequest()
    {
        return $this->hasOne(BookRequest::class)->latest();
    }
}
