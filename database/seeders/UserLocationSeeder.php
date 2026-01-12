<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Darayya Bounds
        $minLat = 33.4400;
        $maxLat = 33.4700;
        $minLng = 36.2200;
        $maxLng = 36.2600;

        $users = User::whereNull('latitude')->orWhereNull('longitude')->get();

        foreach ($users as $user) {
            $user->update([
                'latitude' => $minLat + mt_rand() / mt_getrandmax() * ($maxLat - $minLat),
                'longitude' => $minLng + mt_rand() / mt_getrandmax() * ($maxLng - $minLng),
            ]);
        }
    }
}
