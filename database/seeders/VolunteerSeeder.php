<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VolunteerOpportunity;

class VolunteerSeeder extends Seeder
{
    public function run(): void
    {
        $opportunities = [
            [
                'title' => 'مشرف حي ميداني',
                'description' => 'القيام بجولات ميدانية في الحي لرصد الأعطال والمشاكل الخدمية (حفر، إنارة، تراكم قمامة) ورفعها عبر التطبيق.',
                'role_type' => 'ميداني',
                'location' => 'داريا - أحياء متنوعة',
                'time_commitment' => '3 ساعات أسبوعياً',
                'status' => 'open',
            ],
            [
                'title' => 'فريق تنظيم الفعاليات',
                'description' => 'المساعدة في تنظيم اللقاءات الجماهيرية والفعاليات التطوعية (تنظيف، تشجير).',
                'role_type' => 'إداري',
                'location' => 'مبنى البلدية / ساحات عامة',
                'time_commitment' => 'عند الحاجة (فعالية شهرياً)',
                'status' => 'open',
            ],
            [
                'title' => 'دعم تقني وتوعية',
                'description' => 'مساعدة كبار السن والجيران في استخدام تطبيق "مجتمع داريا" وإنشاء حساباتهم.',
                'role_type' => 'تقني',
                'location' => 'عن بعد / زيارات',
                'time_commitment' => 'مرن',
                'status' => 'open',
            ],
        ];

        foreach ($opportunities as $opportunity) {
            VolunteerOpportunity::create($opportunity);
        }
    }
}
