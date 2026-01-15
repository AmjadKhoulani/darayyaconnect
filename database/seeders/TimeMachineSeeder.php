<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ServiceLog;
use App\Models\Report;
use App\Models\InfrastructurePoint;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TimeMachineSeeder extends Seeder
{
    public function run()
    {
        $neighborhoods = [
            ['name' => 'Al-Kusur', 'lng' => 36.236, 'lat' => 33.456],
            ['name' => 'As-Sijn', 'lng' => 36.231, 'lat' => 33.452],
            ['name' => 'Center', 'lng' => 36.238, 'lat' => 33.458],
        ];

        // Ensure zones exist
        foreach ($neighborhoods as $n) {
            InfrastructurePoint::updateOrCreate(
                ['name' => $n['name'], 'type' => 'neighborhood_zone'],
                [
                    'latitude' => $n['lat'],
                    'longitude' => $n['lng'],
                    'status' => 'active',
                    'geometry' => [
                        'type' => 'Polygon',
                        'coordinates' => [[
                            [$n['lng'] - 0.005, $n['lat'] + 0.005],
                            [$n['lng'] - 0.005, $n['lat'] - 0.005],
                            [$n['lng'] + 0.005, $n['lat'] - 0.005],
                            [$n['lng'] + 0.005, $n['lat'] - 0.005], // Actually close it
                            [$n['lng'] + 0.005, $n['lat'] + 0.005],
                            [$n['lng'] - 0.005, $n['lat'] + 0.005]
                        ]]
                    ]
                ]
            );
        }

        $users = User::all();
        if ($users->count() < 15) {
            $users = User::factory()->count(15)->create();
        }

        // Assign users to neighborhoods
        $userChunks = $users->chunk(5);

        // Generate data for the last 7 days
        for ($i = 0; $i <= 7; $i++) {
            $date = Carbon::today()->subDays($i);
            
            foreach ($neighborhoods as $idx => $n) {
                $neighborhoodUsers = $userChunks->get($idx) ?? $users->take(5);
                
                // Varying status for each neighborhood over time
                $availablePercentage = (10 + ($i * 10) + ($idx * 20)) % 100; 
                
                foreach ($neighborhoodUsers as $user) {
                    $status = rand(0, 100) < $availablePercentage ? 'available' : 'cut_off';
                    
                    ServiceLog::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'service_type' => 'electricity',
                            'log_date' => $date->toDateString()
                        ],
                        [
                            'status' => $status,
                            'neighborhood' => $n['name']
                        ]
                    );
                    
                    // Also water
                    $waterAvailablePercentage = (80 - ($i * 10) - ($idx * 15)) % 100;
                    if ($waterAvailablePercentage < 0) $waterAvailablePercentage += 100;
                    
                    $statusWater = rand(0, 100) < $waterAvailablePercentage ? 'available' : 'cut_off';
                    ServiceLog::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'service_type' => 'water',
                            'log_date' => $date->toDateString()
                        ],
                        [
                            'status' => $statusWater,
                            'neighborhood' => $n['name']
                        ]
                    );
                }
            }

            // Also some random reports for heatmap
            for ($j = 0; $j < 10; $j++) {
                $category = ['electricity', 'water', 'sanitation', 'safety'][rand(0, 3)];
                $severity = rand(1, 5);
                
                Report::create([
                    'category' => $category,
                    'severity' => $severity,
                    'latitude' => 33.45 + (rand(0, 100) / 1000),
                    'longitude' => 36.23 + (rand(0, 100) / 1000),
                    'status' => 'pending',
                    'description' => "Historical report for testing Time Machine",
                    'created_at' => $date->copy()->addHours(rand(0, 23)),
                    'updated_at' => $date->copy()->addHours(rand(0, 23)),
                ]);
            }
        }
    }
}
