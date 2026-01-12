<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PharmacistSeeder extends Seeder
{
    public function run(): void
    {
        $pharmacist = User::updateOrCreate(
            ['email' => 'pharmacy@darayya.net'],
            [
                'name' => 'صيدلية داريا المركزية',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'profession' => 'pharmacist',
                'is_verified_official' => true,
                'latitude' => 33.4585,
                'longitude' => 36.2365,
                'neighborhood' => 'وسط المدينة'
            ]
        );

        DB::table('directory_contacts')->updateOrInsert(
            ['user_id' => $pharmacist->id],
            [
                'name' => 'صيدلية داريا المركزية',
                'role' => 'صيدلية مناوبة',
                'category' => 'health',
                'status' => 'closed',
                'updated_at' => now(),
            ]
        );

        $this->command->info('Pharmacist User Seeded! 💊');
    }
}
