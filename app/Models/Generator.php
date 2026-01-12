<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Generator extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'owner_name',
        'phone',
        'neighborhood',
        'street_address',
        'latitude',
        'longitude',
        'ampere_price',
        'operating_hours',
        'status',
        'last_price_update',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'ampere_price' => 'decimal:2',
        'last_price_update' => 'datetime',
    ];

    protected $appends = ['average_rating', 'ratings_count'];

    public function ratings()
    {
        return $this->hasMany(GeneratorRating::class);
    }

    public function priceHistory()
    {
        return $this->hasMany(GeneratorPriceHistory::class)->latest('changed_at');
    }

    public function subscriptions()
    {
        return $this->hasMany(GeneratorSubscription::class);
    }

    public function getAverageRatingAttribute()
    {
        return round($this->ratings()->avg('overall_rating'), 1) ?? 0;
    }

    public function getRatingsCountAttribute()
    {
        return $this->ratings()->count();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByNeighborhood($query, $neighborhood)
    {
        return $query->where('neighborhood', 'like', "%{$neighborhood}%");
    }
}
