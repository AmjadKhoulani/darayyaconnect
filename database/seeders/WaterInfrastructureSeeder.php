<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\InfrastructurePoint;

class WaterInfrastructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Darayya approx coordinates: 33.456, 36.236
        
        $zones = [
            ['name' => 'المنطقة الشمالية - الكورنيش', 'lat' => 33.460, 'lng' => 36.236],
            ['name' => 'وسط البلد - ساحة الزيتون', 'lat' => 33.456, 'lng' => 36.236],
            ['name' => 'المنطقة الجنوبية - طريق المعامل', 'lat' => 33.450, 'lng' => 36.236],
            ['name' => 'الحي الشرقي', 'lat' => 33.456, 'lng' => 36.242],
            ['name' => 'الحي الغربي', 'lat' => 33.456, 'lng' => 36.230],
            ['name' => 'منطقة الخليج', 'lat' => 33.462, 'lng' => 36.233],
        ];

        foreach ($zones as $zone) {
            InfrastructurePoint::create([
                'type' => 'water_zone',
                'name' => $zone['name'],
                'latitude' => $zone['lat'],
                'longitude' => $zone['lng'],
                'status' => 'stopped', // Default to off
                'category' => 'water',
                'responsible_entity' => 'وحدة مياه داريا',
                'metadata' => [
                    'schedule' => 'السبت والأربعاء',
                    'capacity' => 'عالي',
                    'streets' => ['شارع 1', 'شارع 2']
                ],
                'last_updated_at' => now(),
            ]);
        }
    }
}
