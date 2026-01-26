<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department_id',
        'neighborhood',
        'age',
        'gender',
        'latitude',
        'longitude',
        'is_verified_official',
        'profession',
        'is_resident',
        'location_verified_at',
        'country_code',
        'mobile',
        'last_active_at',
    ];

    /**
     * Scope a query to only include resident users.
     */
    public function scopeResidents($query)
    {
        return $query->where('is_resident', true);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is an official
     */
    public function isOfficial(): bool
    {
        return $this->role === 'official';
    }

    /**
     * Check if user is a citizen
     */
    public function isCitizen(): bool
    {
        return $this->role === 'citizen';
    }

    /**
     * Check if user has a specific role or roles
     */
    public function hasRole(string|array $roles): bool
    {
        if (is_array($roles)) {
            return in_array($this->role, $roles);
        }

        return $this->role === $roles;
    }

    public function sosAlerts()
    {
        return $this->hasMany(SosAlert::class);
    }
}
