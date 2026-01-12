<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generator_price_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('generator_id')->constrained()->onDelete('cascade');
            $table->decimal('old_price', 10, 2);
            $table->decimal('new_price', 10, 2);
            $table->foreignId('changed_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('changed_at');
            
            $table->index('generator_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generator_price_history');
    }
};
