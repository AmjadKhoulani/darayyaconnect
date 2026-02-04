<?php

namespace App\Traits;

use App\Models\City;
use Illuminate\Support\Facades\Auth;

trait HasCityScope
{
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Scope a query to only include records for the current user's city.
     * Super Admins (role admin, city_id null) see everything.
     * City Admins (role admin, city_id set) see only their city.
     */
    public function scopeForUser($query, $user = null)
    {
        $user = $user ?? Auth::user();

        if (!$user) {
            return $query;
        }

        // If Super Admin (Admin with no specific city), show all
        if ($user->role === 'admin' && is_null($user->city_id)) {
            return $query;
        }

        // Otherwise (City Admin, Official, Resident), only show their city
        // Unless it's a model that doesn't have city_id ? (Trait assumes it does)
        if ($user->city_id) {
            return $query->where('city_id', $user->city_id);
        }
        
        return $query;
    }
}
