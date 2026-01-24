<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Check if admin exists
        if (!User::where('email', 'admin@darayya.sy')->exists()) {
            User::create([
                'name' => 'Amjad Admin',
                'email' => 'admin@darayya.sy',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'profession' => 'System Administrator',
                'is_verified_official' => true,
            ]);
        }

        // New requested admin
        if (!User::where('email', 'admin@darayyaconnect.com')->exists()) {
            User::create([
                'name' => 'Super Admin',
                'email' => 'admin@darayyaconnect.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'profession' => 'System Owner',
                'is_verified_official' => true,
            ]);
        }
    }
}
