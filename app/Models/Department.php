<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug'];

    public function serviceLogs()
    {
        return $this->hasMany(ServiceLog::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
