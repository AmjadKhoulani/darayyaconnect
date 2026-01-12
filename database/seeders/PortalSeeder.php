<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Post;
use App\Models\DirectoryContact;

class PortalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Services
        Service::create(['name' => 'الكهرباء', 'status' => 'on', 'details' => 'وصل حالياً', 'icon' => '⚡']);
        Service::create(['name' => 'المياه', 'status' => 'warning', 'details' => 'ضخ ضعيف', 'icon' => '💧']);
        Service::create(['name' => 'الإنترنت', 'status' => 'off', 'details' => 'انقطاع', 'icon' => '🌐']);
        Service::create(['name' => 'الغاز', 'status' => 'on', 'details' => 'متوفر', 'icon' => '🔥']);
        Service::create(['name' => 'الأفران', 'status' => 'on', 'details' => 'تعمل', 'icon' => '🥖']);

        // 2. Posts
        Post::create([
            'author_name' => 'مجلس مدينة داريا',
            'role' => 'جهة رسمية',
            'type' => 'announcement',
            'content' => "أهلنا الكرام، تم بحمد الله الانتهاء من صيانة طريق المعامل وتعبيده بالكامل.\nنشكر المواطنين على صبرهم وتعاونهم معنا لإنجاز هذا المشروع.",
            'image_url' => 'https://images.unsplash.com/photo-1590845947391-ba13a66dd7eb?q=80&w=1000&auto=format&fit=crop',
            'likes_count' => 145,
            'comments_count' => 23,
            'created_at' => now()->subHours(2),
        ]);

        Post::create([
            'author_name' => 'فريق الخدمات',
            'role' => 'إدارة المجتمع',
            'type' => 'poll',
            'content' => "📊 استبيان الأسبوع:\nشاركونا رأيكم، ما هي المنطقة التي تقترحون أن تكون لها الأولوية في حملة التشجير القادمة؟",
            'image_url' => null,
            'likes_count' => 89,
            'comments_count' => 156,
            'metadata' => [
                'options' => [
                    ['id' => 1, 'text' => 'حديقة المركز الثقافي', 'votes' => '45%'],
                    ['id' => 2, 'text' => 'طريق الكورنيش', 'votes' => '30%'],
                    ['id' => 3, 'text' => 'محيط المدارس', 'votes' => '25%'],
                ]
            ],
            'created_at' => now()->subHours(5),
        ]);

        // 3. Directory Contacts
        DirectoryContact::create(['name' => 'د. محمد الأحمد', 'role' => 'طب أطفال', 'category' => 'health', 'rating' => 4.8, 'location' => 'شارع الثورة', 'status' => 'open']);
        DirectoryContact::create(['name' => 'ورشة السلام', 'role' => 'تمديدات صحية', 'category' => 'maintenance', 'rating' => 4.5, 'location' => 'جانب البلدية', 'status' => 'open']);
        DirectoryContact::create(['name' => 'تكسي المدينة', 'role' => 'نقل داخلي', 'category' => 'transport', 'rating' => 4.9, 'location' => 'مكتب الساحة', 'status' => 'open']);
        DirectoryContact::create(['name' => 'مركز النور', 'role' => 'كهربائيات', 'category' => 'maintenance', 'rating' => 4.7, 'location' => 'الكورنيش', 'status' => 'closed']);
        
        // 4. City Priorities (Projects)
        \App\Models\Project::create([
            'title' => 'إنارة الشوارع بالطاقة الشمسية',
            'description' => 'مشروع لتركيب 500 عمود إنارة في الشوارع الرئيسية.',
            'status' => 'in_progress',
            'progress' => 60,
            'votes_count' => 1250,
        ]);
        
        \App\Models\Project::create([
            'title' => 'تزفيت طريق المعامل',
            'description' => 'إعادة تأهيل الطريق الواصل بين الدوار والمنطقة الصناعية.',
            'status' => 'planned',
            'progress' => 0,
            'votes_count' => 890,
        ]);

        // 5. Community Discussions (Requires a User)
        // Creating a dummy user if not exists
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'citizen@darayya.com'],
            ['name' => 'سامر المصري', 'password' => bcrypt('password')]
        );

        \App\Models\Discussion::create([
            'user_id' => $user->id,
            'title' => 'مشكلة النظافة في الحي الشرقي',
            'body' => 'يا جماعة الوضع لا يطاق، الحاويات ممتلئة من يومين. نرجو الحل.',
            'category' => 'complaints',
        ]);

        \App\Models\Discussion::create([
            'user_id' => $user->id,
            'title' => 'اقتراح لتنظيم سوق الخضار',
            'body' => 'ليش ما بنعمل سوق شعبي يوم الجمعة فقط لتخفيف الازدحام؟',
            'category' => 'suggestions',
        ]);
    }
}
