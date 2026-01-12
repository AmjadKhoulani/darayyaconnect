<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generator_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('generator_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('overall_rating'); // 1-5
            $table->tinyInteger('service_quality')->nullable(); // 1-5
            $table->tinyInteger('punctuality')->nullable(); // 1-5
            $table->tinyInteger('power_stability')->nullable(); // 1-5
            $table->tinyInteger('customer_service')->nullable(); // 1-5
            $table->text('comment')->nullable();
            $table->boolean('is_anonymous')->default(true);
            $table->timestamps();
            
            // تقييم واحد لكل مستخدم لكل مولدة
            $table->unique(['generator_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generator_ratings');
    }
};
