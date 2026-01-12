<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Support\Facades\DB;

class VotingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a "Poll" Post
        $poll = Post::create([
            'title' => 'استطلاع رأي: أولويات الصيانة لشهر كانون الثاني',
            'content' => 'برأيك، ما هي المنطقة التي تحتاج إلى صيانة فورية لشبكة المياه؟',
            'type' => 'poll',
            'author_name' => 'مجلس مدينة داريا',
            'role' => 'City Council',
            'metadata' => [
                'options' => [
                    ['id' => 1, 'text' => 'المنطقة الشمالية (الكورنيش)'],
                    ['id' => 2, 'text' => 'وسط البلد (الجامع الكبير)'],
                    ['id' => 3, 'text' => 'الحي الشرقي']
                ]
            ]
        ]);

        // 2. Verified Doctor votes for "Midtown"
        $doctor = User::where('email', 'dr.samer@darayya.net')->first();

        if ($doctor) {
            Vote::create([
                'user_id' => $doctor->id,
                'votable_type' => Post::class,
                'votable_id' => $poll->id,
                'option_id' => 2, // Voted for Option 2
                'value' => 1
            ]);

            $this->command->info('Voting Simulation Complete: Dr. Samer voted for Midtown! 🗳️');
        } else {
            $this->command->warn('Dr. Samer user not found. Run VerifiedUserSeeder first.');
        }
    }
}
