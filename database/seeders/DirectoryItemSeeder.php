<?php

namespace Database\Seeders;

use App\Models\DirectoryItem;
use Illuminate\Database\Seeder;

class DirectoryItemSeeder extends Seeder
{
    public function run(): void
    {
        // Official Entities
        DirectoryItem::create([
            'name' => 'بلدية داريا',
            'phone' => '011-1234567',
            'icon' => 'Landmark',
            'type' => 'خدمي',
            'category' => 'official',
            'is_active' => true,
        ]);

        DirectoryItem::create([
            'name' => 'مخفر داريا',
            'phone' => '0935738430',
            'icon' => 'ShieldCheck',
            'type' => 'أمني',
            'category' => 'official',
            'is_active' => true,
        ]);
        
        DirectoryItem::create([
            'name' => 'محكمة داريا',
            'phone' => '011-7654321',
            'icon' => 'Gavel',
            'type' => 'قضائي',
            'category' => 'official',
            'is_active' => true,
        ]);

        // Internet Companies
        DirectoryItem::create([
            'name' => 'طريق الحرير',
            'phone' => '0912345678',
            'icon' => 'Globe',
            'type' => 'انترنت',
            'category' => 'company',
            'rating' => 4.5,
            'metadata' => ['speed' => 'عالي'],
            'is_active' => true,
        ]);
        
        DirectoryItem::create([
            'name' => 'سوا',
            'phone' => '0923456789',
            'icon' => 'Globe',
            'type' => 'انترنت',
            'category' => 'company',
            'rating' => 4.0,
            'metadata' => ['speed' => 'متوسط'],
            'is_active' => true,
        ]);
    }
}
