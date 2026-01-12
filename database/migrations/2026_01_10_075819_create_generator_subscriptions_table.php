<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generator_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('generator_id')->constrained()->onDelete('cascade');
            $table->boolean('notify_price_change')->default(true);
            $table->boolean('notify_issues')->default(true);
            $table->timestamps();
            
            // اشتراك واحد لكل مستخدم لكل مولدة
            $table->unique(['user_id', 'generator_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generator_subscriptions');
    }
};
