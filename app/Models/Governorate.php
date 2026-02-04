<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Governorate extends Model
{
    protected $fillable = ['name_ar', 'name_en', 'code'];

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
