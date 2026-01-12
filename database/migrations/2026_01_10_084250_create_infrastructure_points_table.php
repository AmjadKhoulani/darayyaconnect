<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('infrastructure_points', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // school, health_center, well, transformer, park, etc.
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('neighborhood')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive', 'under_construction'])->default('active');
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['type', 'status']);
            $table->index('neighborhood');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('infrastructure_points');
    }
};
