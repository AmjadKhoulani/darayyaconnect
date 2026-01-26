<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_channels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->default('Hash');
            $table->timestamps();
        });

        // Seed initial channels
        DB::table('chat_channels')->insert([
            ['name' => 'عام', 'slug' => 'general', 'description' => 'دردشة عامة لكل أهل داريا', 'icon' => 'Hash'],
            ['name' => 'مساعدة', 'slug' => 'help', 'description' => 'طلب وتقديم المساعدة العاجلة', 'icon' => 'Hash'],
            ['name' => 'أخبار-المدينة', 'slug' => 'news', 'description' => 'آخر المستجدات لحظة بلحظة', 'icon' => 'Hash'],
            ['name' => 'بيع-وشراء', 'slug' => 'trading', 'description' => 'سوق محلي لتبادل السلع', 'icon' => 'Hash'],
            ['name' => 'تقنية', 'slug' => 'tech', 'description' => 'نقاشات حول التكنولوجيا والبرمجة', 'icon' => 'Hash'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_channels');
    }
};
