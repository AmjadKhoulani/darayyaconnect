<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VolunteerOpportunity;
use Carbon\Carbon;

class VolunteeringSeeder extends Seeder
{
    public function run()
    {
        VolunteerOpportunity::create([
            'title' => 'حملة تشجير الأحياء الجنوبية',
            'organization' => 'جمعية داريا الخضراء',
            'description' => 'ندعوكم للمشاركة في أكبر حملة تشجير هذا الموسم. سنقوم بزراعة 500 شجرة في المناطق الجنوبية للمدينة.',
            'role_type' => 'field',
            'location' => 'ساحة البلدية - الحي الجنوبي',
            'time_commitment' => '4 ساعات',
            'start_date' => Carbon::parse('next friday 9am'),
            'end_date' => Carbon::parse('next friday 1pm'),
            'spots_total' => 15,
            'spots_filled' => 8,
            'image' => 'https://images.unsplash.com/photo-1542601906990-24ccd08d7455?w=800&q=80',
            'tags' => ['بيئة', 'ميداني', 'زراعة'],
            'status' => 'open'
        ]);

        VolunteerOpportunity::create([
            'title' => 'توزيع السلال الغذائية - رمضان',
            'organization' => 'فريق الإخاء',
            'description' => 'توزيع سلال غذائية على العائلات المحتاجة في شهر رمضان المبارك.',
            'role_type' => 'field',
            'location' => 'مركز التوزيع الرئيسي',
            'time_commitment' => 'يومياً 2 ساعة',
            'start_date' => Carbon::now()->addDays(2),
            'end_date' => Carbon::now()->addDays(30),
            'spots_total' => 50,
            'spots_filled' => 42,
            'image' => 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
            'tags' => ['إغاثة', 'تنظيم'],
            'status' => 'open'
        ]);

        VolunteerOpportunity::create([
            'title' => 'مساعد إداري لتنظيم الأرشيف',
            'organization' => 'المجلس المحلي',
            'description' => 'مطلوب متطوعين للمساعدة في أرشفة الملفات القديمة وتنظيمها.',
            'role_type' => 'administrative',
            'location' => 'مبنى البلدية',
            'time_commitment' => 'دوام جزئي',
            'start_date' => Carbon::now()->addDays(5),
            'end_date' => Carbon::now()->addMonths(1),
            'spots_total' => 2,
            'spots_filled' => 0,
            'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
            'tags' => ['إداري', 'مكتبي'],
            'status' => 'open'
        ]);
    }
}
