<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Initiative;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class InitiativeSeeder extends Seeder
{
    public function run()
    {
        // Get first user or create a default one
        $user = User::first();
        
        if (!$user) {
            $this->command->error('No users found. Please seed users first.');
            return;
        }

        $initiatives = [
            [
                'title' => 'إنشاء حديقة عامة في حي الدوار',
                'description' => 'مبادرة لتحويل الأرض الفارغة إلى حديقة مجتمعية مع ألعاب أطفال ومناطق جلوس للعائلات',
                'status' => 'قيد التنفيذ',
                'votes_count' => 45,
                'user_id' => $user->id
            ],
            [
                'title' => 'برنامج محو الأمية الرقمية',
                'description' => 'تدريب كبار السن على استخدام الهواتف الذكية والإنترنت بشكل آمن وفعال',
                'status' => 'جاري التصويت',
                'votes_count' => 28,
                'user_id' => $user->id
            ],
            [
                'title' => 'مشروع إعادة تدوير النفايات',
                'description' => 'إنشاء نقاط تجميع للنفايات القابلة لإعادة التدوير مع برنامج توعية بيئية',
                'status' => 'جاري التصويت',
                'votes_count' => 67,
                'user_id' => $user->id
            ],
            [
                'title' => 'مكتبة مجتمعية مجانية',
                'description' => 'إنشاء مكتبة عامة مع قاعة قراءة ومساحة للدراسة متاحة لجميع السكان',
                'status' => 'مكتملة',
                'votes_count' => 120,
                'user_id' => $user->id
            ],
            [
                'title' => 'نادي رياضي للشباب',
                'description' => 'تأسيس نادي رياضي يقدم أنشطة متنوعة (كرة قدم، سلة، فنون قتالية) للشباب واليافعين',
                'status' => 'جاري التصويت',
                'votes_count' => 89,
                'user_id' => $user->id
            ]
        ];

        foreach ($initiatives as $initiative) {
            Initiative::create($initiative);
        }

        $this->command->info('Seeded ' . count($initiatives) . ' initiatives successfully!');
    }
}
