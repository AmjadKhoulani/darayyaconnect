<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Report;
use App\Models\ServiceLog;
use App\Models\DirectoryContact;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FixSystemStateSeeder extends Seeder
{
    public function run(): void
    {
        // ---------------------------------------------------------
        // 1. Ensure Pharmacist Account Exists & Linked
        // ---------------------------------------------------------
        $pharmacist = User::updateOrCreate(
            ['email' => 'pharmacy@darayya.net'],
            [
                'name' => 'صيدلية داريا المركزية',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'profession' => 'pharmacist',
                'is_verified_official' => true,
                'neighborhood' => 'وسط المدينة'
            ]
        );

        // Link in Directory (Crucial for "Duty" toggle to work)
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
        $this->command->info('✅ Pharmacist Account Fixed.');

        // ---------------------------------------------------------
        // 2. Populate Official Dashboards (Eliminate Empty Pages)
        // ---------------------------------------------------------
        
        // Departments: 1=Water, 2=Electricity, 3=Municipality
        $depts = [
            1 => ['slug' => 'water', 'issue' => 'تسرب مياه', 'log' => 'water'],
            2 => ['slug' => 'electricity', 'issue' => 'كيبل مقطوع', 'log' => 'electricity'],
            3 => ['slug' => 'municipality', 'issue' => 'حفرة في الطريق', 'log' => 'sanitation'],
        ];

        $citizen = User::where('email', 'test@example.com')->first();
        if (!$citizen) {
             $citizen = User::create([
                 'name' => 'Test Citizen', 
                 'email' => 'test@example.com', 
                 'password' => Hash::make('password')
             ]);
        }

        foreach ($depts as $id => $data) {
            // Create Reports
            if (Report::where('department_id', $id)->count() < 5) {
                Report::create([
                    'type' => 'problem',
                    'description' => "بلاغ تجريبي: {$data['issue']} - منطقة الكورنيش",
                    'status' => 'pending',
                    'department_id' => $id,
                    'department_assigned' => true,
                    'is_anonymous' => false,
                ]);
                Report::create([
                    'type' => 'complaint',
                    'description' => "بلاغ عاجل: {$data['issue']} - قرب المدرسة",
                    'status' => 'received',
                    'department_id' => $id,
                    'department_assigned' => true,
                    'is_anonymous' => true,
                ]);
            }

            // Create Service Logs (Crowdsourced info)
            // Use different users or dates to avoid unique constraint
            
            if (ServiceLog::where('department_id', $id)->count() < 5) {
                // Log 1: Available
                ServiceLog::firstOrCreate(
                    [
                        'user_id' => $citizen->id,
                        'service_type' => $data['log'],
                        'log_date' => Carbon::today(), // Uniqueness key
                    ],
                    [
                        'status' => 'available',
                        'department_id' => $id,
                        'created_at' => Carbon::now()->subMinutes(rand(1, 120))
                    ]
                );

                // Log 2: Outage (Use yesterday to allow both)
                ServiceLog::firstOrCreate(
                    [
                        'user_id' => $citizen->id,
                        'service_type' => $data['log'],
                        'log_date' => Carbon::yesterday(), // Use yesterday to avoid collision
                    ],
                    [
                        'status' => 'outage',
                        'department_id' => $id,
                        'created_at' => Carbon::yesterday()->addHours(10)
                    ]
                );
            }
        }
        $this->command->info('✅ Official Dashboards Populated with Data.');

        // ---------------------------------------------------------
        // 3. Ensure Admin Exists
        // ---------------------------------------------------------
        User::updateOrCreate(
            ['email' => 'admin@darayya.gov'],
            [
                'name' => 'المشرف العام',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_verified_official' => true
            ]
        );
        $this->command->info('✅ Admin Account Checked.');
    }
}
