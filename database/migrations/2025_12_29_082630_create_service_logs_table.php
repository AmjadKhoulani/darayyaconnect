<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('service_type'); // electricity, water
            $table->date('log_date');
            $table->string('status'); // available, cut_off
            $table->time('arrival_time')->nullable();
            $table->decimal('duration_hours', 4, 2)->nullable(); // e.g., 2.5 hours
            $table->string('neighborhood')->nullable(); // Snapshot of user location
            $table->timestamps();

            // Prevent duplicate logs for same service/day/user
            $table->unique(['user_id', 'service_type', 'log_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_logs');
    }
};
