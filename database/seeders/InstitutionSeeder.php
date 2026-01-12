<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class InstitutionSeeder extends Seeder
{
    public function run(): void
    {
        $institutions = [
            [
                'name' => 'جامع المصطفى',
                'email' => 'mosque.mustafa@darayya.local',
                'category' => 'mosque',
                'role_title' => 'إمام المسجد',
                'location' => 'وسط الميدان',
            ],
            [
                'name' => 'ثانوية داريا للبنات',
                'email' => 'school.girls@darayya.local',
                'category' => 'education',
                'role_title' => 'الإدارة',
                'location' => 'الشارع العام',
            ],
            [
                'name' => 'مختار الحي الغربي',
                'email' => 'mukhtar.west@darayya.local',
                'category' => 'public',
                'role_title' => 'المختار',
                'location' => 'مكتب المختار',
            ],
            [
                'name' => 'مستوصف الرضوان',
                'email' => 'clinic.radwan@darayya.local',
                'category' => 'health',
                'role_title' => 'الإدارة الطبية',
                'location' => 'حي الققب',
            ],
        ];

        foreach ($institutions as $inst) {
            // 1. Create User
            $user = User::create([
                'name' => $inst['name'],
                'email' => $inst['email'],
                'password' => Hash::make('password'),
                'role' => 'institution', // New role type
                'is_verified_official' => true,
                'profession' => $inst['role_title'],
            ]);

            // 2. Create Directory Entry Linked to User
            DB::table('directory_contacts')->insert([
                'user_id' => $user->id,
                'name' => $inst['name'],
                'role' => $inst['role_title'],
                'category' => $inst['category'],
                'phone' => '011-000000',
                'location' => $inst['location'],
                'status' => 'open',
                'rating' => 5.0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
