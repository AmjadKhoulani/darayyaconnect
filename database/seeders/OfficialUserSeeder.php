<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;

class OfficialUserSeeder extends Seeder
{
    public function run(): void
    {
        // Define Officials
        $officials = [
            [
                'name' => 'Water Authority Rep',
                'email' => 'water@darayya.gov',
                'dept_slug' => 'water'
            ],
            [
                'name' => 'Electricity Co Rep',
                'email' => 'electricity@darayya.gov',
                'dept_slug' => 'electricity'
            ],
            [
                'name' => 'Municipality Admin',
                'email' => 'municipality@darayya.gov', // Updated to match user preference
                'dept_slug' => 'municipality'
            ],
            [
                'name' => 'Telecom Engineer',
                'email' => 'telecom@darayya.gov',
                'dept_slug' => 'telecom'
            ],
        ];

        foreach ($officials as $official) {
            $dept = Department::where('slug', $official['dept_slug'])->first();

            if ($dept) {
                User::updateOrCreate(
                    ['email' => $official['email']],
                    [
                        'name' => $official['name'],
                        'password' => Hash::make('password'),
                        'role' => 'official',
                        'department_id' => $dept->id,
                        'age' => 35,
                        'gender' => 'male',
                        'is_verified_official' => true,
                        // Dummy location for backend requirements, officials might be anywhere
                        'latitude' => 33.4585,
                        'longitude' => 36.2365,
                        'neighborhood' => 'Hayy Al-Baladiyya'
                    ]
                );
            }
        }
        
        $this->command->info('Official Government Accounts Created! 🏛️');
    }
}
