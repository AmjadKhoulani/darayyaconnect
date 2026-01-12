<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InfrastructurePoint;

class PublicAssetsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Education: Darayya High School (Needs Repair)
        InfrastructurePoint::create([
            'name' => 'ثانوية داريا للبنات',
            'type' => 'school',
            'category' => 'education',
            'latitude' => 33.4560,
            'longitude' => 36.2300,
            'status' => 'maintenance', // Operational but needs work
            'condition' => 'fair',
            'responsible_entity' => 'municipality', // Should link to user later
            'metadata' => [
                'capacity' => 1200,
                'principal' => 'Mrs. Huda',
                'built_year' => 1995
            ],
            'last_maintenance_date' => now()->subYears(2),
            'images_before' => ['https://example.com/school-old.jpg'],
            'images_after' => null, // Not fixed yet
        ]);

        // 2. Health: Al-Salam Medical Center
        InfrastructurePoint::create([
            'name' => 'مركز السلام الطبي',
            'type' => 'health_center',
            'category' => 'health',
            'latitude' => 33.4600,
            'longitude' => 36.2350,
            'status' => 'active',
            'condition' => 'good',
            'responsible_entity' => 'health_dept',
            'metadata' => [
                'specialties' => ['General', 'Dental', 'Pediatric'],
                'working_hours' => '8:00 AM - 4:00 PM'
            ],
            'last_maintenance_date' => now()->subMonths(3),
            'images_before' => null,
            'images_after' => ['https://example.com/clinic-new.jpg'],
        ]);

        // 3. Public Space: Al-Bustan Park
        InfrastructurePoint::create([
            'name' => 'حديقة البستان',
            'type' => 'park',
            'category' => 'public_spaces',
            'latitude' => 33.4520,
            'longitude' => 36.2250,
            'status' => 'active',
            'condition' => 'good',
            'responsible_entity' => 'municipality',
            'metadata' => [
                'area_sqm' => 5000,
                'features' => ['Playground', 'Fountain', 'Benches']
            ],
            'last_maintenance_date' => now()->subWeeks(2),
            'images_before' => null,
            'images_after' => null,
        ]);
        
        $this->command->info('Public Assets Registry Seeded Successfully! 🏛️');
    }
}
