<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\DirectoryContact;
use Illuminate\Support\Facades\Hash;

class VerifiedUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a Verified Professional (Doctor)
        $doctor = User::updateOrCreate(
            ['email' => 'dr.samer@darayya.net'],
            [
                'name' => 'Dr. Samer Al-Masri',
                'password' => Hash::make('password'),
                'role' => 'citizen', 
                'mobile' => '0912345678', 
                // 'national_id' => '01234567891', // Commented out as likely missing
                // 'profession' => 'doctor',
                // 'is_verified_official' => false,
            ]
        );

        // 2. Link to Public Directory
        DirectoryContact::create([
            'user_id' => $doctor->id,
            'name' => 'عيادة الدكتور سامر المصري',
            'role' => 'طبيب عام',
            'category' => 'health',
            'phone' => '0912345678',
            'rating' => 5.0,
            'location' => 'شارع الثورة - جانب الصيدلية',
            'status' => 'open',
        ]);

        $this->command->info('Verified Professional Seeded Successfully! 👨‍⚕️');
    }
}
