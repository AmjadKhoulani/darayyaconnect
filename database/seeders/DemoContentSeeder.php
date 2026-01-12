<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Discussion;
use App\Models\Initiative;
use App\Models\Book;
use App\Models\Post;
use App\Models\ServiceAlert;

class DemoContentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Truncate Tables to start fresh
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('ai_studies')->truncate();
        DB::table('discussions')->truncate();
        DB::table('initiatives')->truncate();
        DB::table('books')->truncate();
        DB::table('posts')->truncate();
        DB::table('service_alerts')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Ensure we have a user
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Demo User',
                'email' => 'demo@darayya.sy',
            ]);
        }

        // 3. Run AI Studies Seeder
        $this->call(AiStudySeeder::class);

        // 4. Create Discussions
        Discussion::create([
            'user_id' => $user->id,
            'title' => 'كيف يمكننا تحسين خدمة النظافة في الحي الشرقي؟',
            'body' => 'ألاحظ تراكم النفايات في بعض الزوايا، هل من مقترحات لحملة تنظيف؟',
            'category' => 'services',
            'views' => 150
        ]);

        Discussion::create([
            'user_id' => $user->id,
            'title' => 'مبادرة زراعة الأشجار - شاركونا',
            'body' => 'نخطط لزراعة 50 شجرة في الكورنيش، نحتاج متطوعين يوم الجمعة.',
            'category' => 'initiatives',
            'views' => 85
        ]);

        Discussion::create([
            'user_id' => $user->id,
            'title' => 'هل يوجد صيدلية مناوبة قريبة من دوار الباسل؟',
            'body' => 'أحتاج دواء ضروري، يرجى المساعدة.',
            'category' => 'general',
            'views' => 320
        ]);

        // 5. Create Initiatives
        Initiative::create([
            'user_id' => $user->id,
            'title' => 'إنارة الشارع الرئيسي',
            'description' => 'مشروع تطوعي لتركيب أجهزة إنارة بالطاقة الشمسية.',
            'status' => 'active',
            'image' => null // Or a path if you have one
        ]);

        Initiative::create([
            'user_id' => $user->id,
            'title' => 'تنظيف الحديقة العامة',
            'description' => 'حملة تنظيف وإعادة تأهيل مقاعد الحديقة.',
            'status' => 'active',
            'image' => null
        ]);

        // 6. Create Books
        Book::create([
            'user_id' => $user->id,
            'title' => 'مقدمة في الذكاء الاصطناعي',
            'author' => 'د. خالد',
            'condition' => 'new',
            'category' => 'science',
            'status' => 'available',
            'contact_info' => '0912345678'
        ]);

        Book::create([
            'user_id' => $user->id,
            'title' => 'رواية قواعد العشق الأربعون',
            'author' => 'elif shafak',
            'condition' => 'good',
            'category' => 'novel',
            'status' => 'available',
            'contact_info' => '0987654321'
        ]);

        // 7. Create Service Alerts
        ServiceAlert::create([
            'title' => 'صيانة شبكة المياه',
            'body' => 'سيتم قطع المياه عن الحي الغربي غداً للصيانة من 9 صباحاً حتى 2 ظهراً.',
            'type' => 'warning',
            'is_active' => true
        ]);
        
         ServiceAlert::create([
            'title' => 'توزيع الخبز',
            'body' => 'بدء توزيع الخبز في المعتمدين الساعة 7 صباحاً.',
            'type' => 'info',
            'is_active' => true
        ]);

        $this->command->info('Demo Content Seeded Successfully!');
    }
}
