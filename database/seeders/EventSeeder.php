<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Department;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $dept = Department::where('name', 'Municipality')->first();
        if (!$dept) return;

        Event::create([
            'title' => 'اجتماع مناقشة ميزانية الحي 💰',
            'description' => 'ندعوكم لحضور الاجتماع السنوي لمناقشة توزيع ميزانية الخدمات لعام 2026. صوتكم يهمنا لتحديد الأولويات.',
            'start_time' => now()->addDays(3)->setTime(18, 0),
            'end_time' => now()->addDays(3)->setTime(20, 0),
            'location_name' => 'المركز الثقافي - القاعة الرئيسية',
            'department_id' => $dept->id
        ]);
        
        $this->command->info('Town Hall Event Seeded! 📅');
    }
}
