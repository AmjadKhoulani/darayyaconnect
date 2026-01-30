<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CarouselItem;

class CarouselSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CarouselItem::create([
            'title' => 'مستقبل داريا الرقمي',
            'description' => 'نعمل على بناء بيئة ذكية متكاملة تخدم المواطن وتسهل الوصول للخدمات الأساسية عبر التكنولوجيا الحديثة.',
            'type' => 'general',
            'button_text' => 'استكشف الخدمات',
            'button_link' => '/services',
            'order' => 1,
            'is_active' => true,
        ]);

        CarouselItem::create([
            'title' => 'التجارب العالمية في المدن الذكية',
            'description' => 'نستعرض أفضل الممارسات الدولية في إدارة المدن وتحويلها إلى مدن ذكية مستدامة.',
            'type' => 'global',
            'button_text' => 'اقرأ المزيد',
            'button_link' => '/ai-studies',
            'order' => 2,
            'is_active' => true,
        ]);

        CarouselItem::create([
            'title' => 'حملات التوعية المجتمعية',
            'description' => 'شارك معنا في نشر الوعي حول أهمية الحفاظ على المرافق العامة والبيئة في مدينتنا.',
            'type' => 'awareness',
            'button_text' => 'انضم إلينا',
            'button_link' => '/community',
            'order' => 3,
            'is_active' => true,
        ]);
    }
}
