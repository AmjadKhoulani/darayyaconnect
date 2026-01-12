<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Core Auth & Users (Skipping to avoid duplicates)
            // DepartmentSeeder::class,
            // OfficialUserSeeder::class,
            // VerifiedUserSeeder::class,
            
            // Feature Content
            PortalSeeder::class, // Services, Posts, Directory, Discussions
            InitiativeSeeder::class, // Community Initiatives
            InfrastructureSeeder::class, // Map Points
            AiStudySeeder::class, // AI Studies
            VolunteerSeeder::class, // Volunteer Opportunities
            ServiceAndPharmacySeeder::class, // Pharmacies
        ]);
    }
}
