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
        Schema::create('locations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', ['well', 'transformer', 'road', 'building', 'density_zone']);
            $table->geometry('coordinates');
            $table->enum('status', ['active', 'damaged', 'maintenance', 'unsafe']);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->spatialIndex('coordinates');
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->geometry('coordinates')->nullable();
            $table->enum('category', ['electricity', 'water', 'sanitation', 'safety']);
            $table->integer('severity')->default(1);
            $table->text('description');
            $table->enum('status', ['pending', 'verified', 'scheduled', 'resolved'])->default('pending');
            $table->json('images')->nullable();
            $table->timestamps();
        });

        Schema::create('complaints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('subject');
            $table->text('body');
            $table->string('category')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('locations');
    }
};
