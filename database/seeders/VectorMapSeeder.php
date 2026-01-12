<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InfrastructurePoint;
use App\Models\Project; // We will link to this later

class VectorMapSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Cleanup: Wipe slate clean
        InfrastructurePoint::whereNotNull('geometry')->delete();

        // -------------------------
        // 1. Darayya Municipality (Center) - Blue
        // -------------------------
        // ~30m x 30m block
        $centerLat = 33.4585;
        $centerLng = 36.2365;
        $size = 0.0003; 

        InfrastructurePoint::create([
            'name' => 'مبنى البلدية',
            'type' => 'public_building',
            'category' => 'public_spaces', // Government
            'latitude' => $centerLat,
            'longitude' => $centerLng,
            'status' => 'active',
            'condition' => 'good', // Blue color in frontend
            'height' => 18.0, // 5-6 floors
            'responsible_entity' => 'municipality',
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$centerLng, $centerLat],
                    [$centerLng + $size, $centerLat],
                    [$centerLng + $size, $centerLat + $size],
                    [$centerLng, $centerLat + $size],
                    [$centerLng, $centerLat]
                ]]
            ],
            'metadata' => ['floors' => 6, 'built_year' => 1990],
        ]);

        // -------------------------
        // 2. Al-Amal School (East) - Green
        // -------------------------
        $schoolLat = $centerLat;
        $schoolLng = $centerLng + 0.0008; // Shift East

        InfrastructurePoint::create([
            'name' => 'مدرسة الأمل',
            'type' => 'school',
            'category' => 'education',
            'latitude' => $schoolLat,
            'longitude' => $schoolLng,
            'status' => 'active',
            'condition' => 'good', // Blue/Standard -> maybe we need a specific 'school' color logic later, but 'good' is fine
            'height' => 12.0, // 3-4 floors
            'responsible_entity' => 'education_ministry',
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$schoolLng, $schoolLat],
                    [$schoolLng + $size, $schoolLat],
                    [$schoolLng + $size, $schoolLat + ($size*1.5)], // Rectangular
                    [$schoolLng, $schoolLat + ($size*1.5)],
                    [$schoolLng, $schoolLat]
                ]]
            ],
            'metadata' => ['capacity' => 800, 'students' => 750],
        ]);

        // -------------------------
        // 3. Darayya Health Center (West) - active
        // -------------------------
        $healthLat = $centerLat;
        $healthLng = $centerLng - 0.0008; // Shift West

        InfrastructurePoint::create([
            'name' => 'مستوصف داريا الخيري',
            'type' => 'health_center',
            'category' => 'health',
            'latitude' => $healthLat,
            'longitude' => $healthLng,
            'status' => 'active',
            'condition' => 'fair', // Amber
            'height' => 10.0,
            'responsible_entity' => 'health_ministry',
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$healthLng, $healthLat],
                    [$healthLng + $size, $healthLat],
                    [$healthLng + $size, $healthLat + $size],
                    [$healthLng, $healthLat + $size],
                    [$healthLng, $healthLat]
                ]]
            ],
            'metadata' => ['doctors' => 12, 'specialties' => 5],
        ]);

        // -------------------------
        // 4. Public Park (North) - Flat Green Zone
        // -------------------------
        $parkLat = $centerLat + 0.0006;
        $parkLng = $centerLng - 0.0002;

        InfrastructurePoint::create([
            'name' => 'حديقة الباسل',
            'type' => 'park',
            'category' => 'public_spaces',
            'latitude' => $parkLat,
            'longitude' => $parkLng,
            'status' => 'active',
            'condition' => 'good',
            'height' => 0.5, // Almost flat
            'responsible_entity' => 'municipality',
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$parkLng, $parkLat],
                    [$parkLng + ($size*2.5), $parkLat],
                    [$parkLng + ($size*2.5), $parkLat + $size],
                    [$parkLng, $parkLat + $size],
                    [$parkLng, $parkLat]
                ]]
            ],
            'metadata' => ['trees' => 50, 'playground' => true],
        ]);

        // -------------------------
        // 5. Revolution Street (CRITICAL INFRASTRUCTURE)
        // -------------------------
        // Connects Health Center (West) to School (East), passing south of Municipality
        $streetY = $centerLat - 0.0002; // South of buildings

        InfrastructurePoint::create([
            'name' => 'شارع الثورة',
            'type' => 'road',
            'category' => 'transport',
            'latitude' => $streetY,
            'longitude' => $centerLng,
            'status' => 'maintenance',
            'condition' => 'poor', // RED color
            'height' => 0,
            'responsible_entity' => 'municipality',
            'geometry' => [
                'type' => 'LineString',
                'coordinates' => [
                    [$healthLng, $streetY], // From West
                    [$schoolLng + $size, $streetY]  // To East
                ]
            ],
            'metadata' => ['lanes' => 2, 'surface' => 'damaged'],
        ]);

        // -------------------------
        // 6. Create the "Project" for Voting (Revolution Street)
        // -------------------------
        $project = Project::firstOrCreate(
            ['title' => 'مشروع تعبيد شارع الثورة'],
            [
                'description' => 'إعادة تأهيل الشارع الواصل بين المستوصف والمدرسة وتعبيده بالإسفلت.',
                'status' => 'planned',
                'budget' => 50000000,
                'start_date' => now()->addMonth(),
                'end_date' => now()->addMonths(3),
                'location' => 'حي البلدية',
                'bottleneck_reason' => null // Not staged yet
            ]
        );

        // -------------------------
        // 7. Stalled Projects (Bottleneck Registry Demo)
        // -------------------------
        
        // Stalled by Materials
        Project::firstOrCreate(
            ['title' => 'صيانة شبكة الصرف الصحي - الحي الشرقي'],
            [
                'description' => 'استبدال القساطل المتضررة.',
                'status' => 'in_progress', // Technically active but stalled
                'budget' => 25000000,
                'start_date' => now()->subMonths(2),
                'location' => 'الحي الشرقي',
                'bottleneck_reason' => 'materials',
                'bottleneck_details' => 'تأخر توريد القساطل الاسمنتية من المصدر.',
                'bottleneck_date' => now()->subDays(45) // Stalled for 45 days
            ]
        );

        // Stalled by Funding
        Project::firstOrCreate(
            ['title' => 'مركز الدعم النفسي'],
            [
                'description' => 'بناء مركز جديد للأطفال.',
                'status' => 'planned',
                'budget' => 150000000,
                'start_date' => now()->subMonths(6),
                'location' => 'وسط المدينة',
                'bottleneck_reason' => 'funding',
                'bottleneck_details' => 'بانتظار تحويل الدفعة الثانية من المنحة.',
                'bottleneck_date' => now()->subDays(120) // Stalled for 4 months
            ]
        );

        // Stalled by Approval
        Project::firstOrCreate(
            ['title' => 'إنارة الكورنيش بالطاقة الشمسية'],
            [
                'description' => 'تركيب 50 عمود إنارة.',
                'status' => 'planned',
                'budget' => 75000000,
                'start_date' => now()->subMonth(),
                'location' => 'الكورنيش',
                'bottleneck_reason' => 'approval',
                'bottleneck_details' => 'بانتظار الموافقة الفنية على نوع البطاريات.',
                'bottleneck_date' => now()->subDays(20)
            ]
        );

        // -------------------------
        // 8. Neighborhood Zones (For City Pulse)
        // -------------------------
        
        // Zone A: Hayy Al-Baladiyya (Center)
        InfrastructurePoint::create([
            'name' => 'حي البلدية',
            'type' => 'neighborhood_zone',
            'category' => 'zone',
            'latitude' => $centerLat,
            'longitude' => $centerLng,
            'status' => 'active',
            'condition' => 'good',
            'height' => 0,
            'responsible_entity' => 'municipality',
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$centerLng - 0.002, $centerLat - 0.002],
                    [$centerLng + 0.002, $centerLat - 0.002],
                    [$centerLng + 0.002, $centerLat + 0.002],
                    [$centerLng - 0.002, $centerLat + 0.002],
                    [$centerLng - 0.002, $centerLat - 0.002]
                ]]
            ],
            'metadata' => ['population' => 5000],
        ]);

        // Zone B: Hayy Al-Shamiyat (East)
        InfrastructurePoint::create([
            'name' => 'حي الشاميات',
            'type' => 'neighborhood_zone',
            'category' => 'zone',
            'latitude' => $centerLat,
            'longitude' => $centerLng + 0.004,
            'status' => 'active',
            'condition' => 'fair',
            'height' => 0,
            'responsible_entity' => 'municipality',
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$centerLng + 0.002, $centerLat - 0.002],
                    [$centerLng + 0.006, $centerLat - 0.002],
                    [$centerLng + 0.006, $centerLat + 0.002],
                    [$centerLng + 0.002, $centerLat + 0.002],
                    [$centerLng + 0.002, $centerLat - 0.002]
                ]]
            ],
            'metadata' => ['population' => 3500],
        ]);

        $this->command->info('Curated Map & Project & Bottlenecks & Zones Seeded! 🏙️🚦💓');
    }
}
