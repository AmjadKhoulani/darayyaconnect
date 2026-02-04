<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = ['governorate_id', 'name_ar', 'name_en', 'code', 'is_active'];

    public function governorate()
    {
        return $this->belongsTo(Governorate::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
