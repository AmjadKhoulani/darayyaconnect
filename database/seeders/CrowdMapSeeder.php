<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ServiceLog;
use App\Models\InfrastructurePoint;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CrowdMapSeeder extends Seeder
{
    public function run()
    {
        // 1. Create a Neighborhood Zone (Darayya Center Area)
        $neighborhoodName = 'Al-Kusur';
        
        $zone = InfrastructurePoint::updateOrCreate(
            ['name' => $neighborhoodName, 'type' => 'neighborhood_zone'],
            [
                'latitude' => 33.456,
                'longitude' => 36.236,
                'status' => 'active',
                'geometry' => [
                    'type' => 'Polygon',
                    'coordinates' => [[
                        [36.232, 33.460], // TL
                        [36.232, 33.450], // BL
                        [36.240, 33.450], // BR
                        [36.240, 33.460], // TR
                        [36.232, 33.460]  // TL
                    ]]
                ]
            ]
        );

        $this->command->info("Neighborhood Zone '{$neighborhoodName}' created.");

        // 2. Create 10 Users in this Neighborhood
        $users = User::factory()->count(10)->create([
            'neighborhood' => $neighborhoodName,
            'password' => Hash::make('password'),
            'latitude' => 33.455,
            'longitude' => 36.235
        ]);

        $this->command->info("10 Users created in '{$neighborhoodName}'.");

        // 3. Create Service Logs (7 Available, 3 Cutoff) -> Should result in ~70% -> Green
        foreach ($users->take(7) as $user) {
            ServiceLog::create([
                'user_id' => $user->id,
                'service_type' => 'electricity',
                'status' => 'available',
                'log_date' => Carbon::today(),
                'arrival_time' => '10:00',
                'department_id' => 1,
                'neighborhood' => $neighborhoodName
            ]);
        }

        foreach ($users->skip(7) as $user) {
            ServiceLog::create([
                'user_id' => $user->id,
                'service_type' => 'electricity',
                'status' => 'cut_off',
                'log_date' => Carbon::today(),
                'department_id' => 1,
                'neighborhood' => $neighborhoodName
            ]);
        }

        $this->command->info("Service Logs created: 7 Available, 3 Cutoff.");
    }
}
