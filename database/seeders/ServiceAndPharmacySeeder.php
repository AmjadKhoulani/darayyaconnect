<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class ServiceAndPharmacySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Services (Water & Electricity)
        $services = [
            ['name' => 'الكهرباء (المدينة)', 'status' => 'off', 'details' => 'مقطوعة حالياً', 'icon' => '⚡'],
            ['name' => 'المياه (الحي الشرقي)', 'status' => 'on', 'details' => 'يتم الضخ الآن', 'icon' => '💧'],
            ['name' => 'المياه (الحي الغربي)', 'status' => 'off', 'details' => 'الدور غداً', 'icon' => '🚰'],
        ];

        foreach ($services as $svc) {
            DB::table('services')->insertOrIgnore(array_merge($svc, [
                'created_at' => now(), 'updated_at' => now()
            ]));
        }

        // 2. Seed a Pharmacy User
        $user = User::create([
            'name' => 'صيدلية الشفاء',
            'email' => 'pharmacy.shifa@darayya.local',
            'password' => Hash::make('password'),
            'role' => 'institution',
            'is_verified_official' => true,
            'profession' => 'صيدلي مناوب',
        ]);

        DB::table('directory_contacts')->insert([
            'user_id' => $user->id,
            'name' => 'صيدلية الشفاء',
            'role' => 'صيدلي مناوب',
            'category' => 'health', // We'll query by name containing 'صيدلية' as done in route
            'phone' => '011-555666',
            'location' => 'دوار الباسل',
            'status' => 'open', // Open by default for testing
            'rating' => 4.8,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
