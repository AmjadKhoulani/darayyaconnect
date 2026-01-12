<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\InfrastructurePoint;
use App\Models\Report;
use App\Models\Project;

class InfrastructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Electricity Transformers (محولات الكهرباء)
        InfrastructurePoint::create([
            'type' => 'transformer',
            'name' => 'محولة الكورنيش الشمالي',
            'latitude' => 33.4586,
            'longitude' => 36.2364,
            'status' => 'active',
            'responsible_entity' => 'دائرة كهرباء داريا',
            'metadata' => ['capacity' => '1000KVA', 'coverage' => 'الحي الشمالي'],
            'last_updated_at' => now(),
        ]);

        InfrastructurePoint::create([
            'type' => 'transformer',
            'name' => 'محولة دوار الباسل',
            'latitude' => 33.4600,
            'longitude' => 36.2400,
            'status' => 'maintenance',
            'responsible_entity' => 'دائرة كهرباء داريا',
            'metadata' => ['capacity' => '500KVA', 'issue' => 'زيادة أحمال'],
            'last_updated_at' => now()->subDays(2),
        ]);

        // 2. Water Wells (آبار المياه)
        InfrastructurePoint::create([
            'type' => 'well',
            'name' => 'بئر الفصول الأربعة',
            'latitude' => 33.4550,
            'longitude' => 36.2300,
            'status' => 'active',
            'responsible_entity' => 'وحدة مياه داريا',
            'metadata' => ['depth' => '150m', 'pump_status' => 'working'],
            'last_updated_at' => now(),
        ]);

        InfrastructurePoint::create([
            'type' => 'well',
            'name' => 'بئر المنطقة الشرقية',
            'latitude' => 33.4520,
            'longitude' => 36.2500,
            'status' => 'stopped',
            'responsible_entity' => 'وحدة مياه داريا',
            'metadata' => ['reason' => 'عطل فني في الغاطس'],
            'last_updated_at' => now()->subWeek(),
        ]);

        // 4. Link a Project to specific Infrastructure (Smart Priority Test)
        // Let's assume 'East Well' id is 2 (from previous seeder)
        // Or better, fetch it dynamically
        $stoppedWell = InfrastructurePoint::where('status', 'stopped')->first();
        
        if ($stoppedWell) {
            $project = Project::create([
                'title' => 'إعادة تأهيل ' . $stoppedWell->name,
                'description' => 'المشروع ذو الأولوية القصوى بناءً على بلاغات السكان وتوقف البئر عن الخدمة.',
                'status' => 'planned',
                'progress' => 0,
                'votes_count' => 120,
                'infrastructure_point_id' => $stoppedWell->id,
            ]);

            // Create 15 reports for this well to boost its score
            Report::factory()->count(15)->create([
                'type' => 'outage',
                'infrastructure_point_id' => $stoppedWell->id,
            ]);
        }
    }
}
