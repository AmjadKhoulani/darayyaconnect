<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\Department;

class PollSeeder extends Seeder
{
    public function run(): void
    {
        $dept = Department::where('name', 'Municipality')->first();
        if (!$dept) return;

        $poll = Poll::create([
            'title' => 'تطوير شارع الثورة 🛣️',
            'description' => 'هل تؤيد تحويل شارع الثورة إلى اتجاه واحد مع توسيع الأرصفة للمشاة؟',
            'department_id' => $dept->id,
            'status' => 'active',
            'expires_at' => now()->addDays(7)
        ]);

        PollOption::create(['poll_id' => $poll->id, 'label' => 'نعم، أؤيد ذلك بشدة ✅']);
        PollOption::create(['poll_id' => $poll->id, 'label' => 'لا، أفضل بقاءه كما هو ❌']);
        PollOption::create(['poll_id' => $poll->id, 'label' => 'موافق بشرط توفير مواقف 🚗']);

        $this->command->info('Active Poll Seeded! 📊');
    }
}
