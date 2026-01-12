<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Location extends Model
{
    use HasUuids;

    protected $fillable = [
        'type',
        'coordinates',
        'status',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the coordinates as an array.
     */
    public function getCoordinatesAttribute($value)
    {
        // Convert WKT or Binary to array if needed, but for now we might rely on DB raw selection
        return $value; 
    }

    public function newQuery($excludeDeleted = true)
    {
        $raw = 'ST_AsGeoJSON(coordinates) as geojson';
        return parent::newQuery($excludeDeleted)->addSelect('*', DB::raw($raw));
    }
}
