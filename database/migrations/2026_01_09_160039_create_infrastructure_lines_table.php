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
        Schema::create('infrastructure_lines', function (Blueprint $table) {
            $table->id();
            $table->string('type')->index(); // water, electricity, sewage, phone
            $table->json('coordinates'); // Array of [lng, lat] arrays
            $table->string('status')->default('active'); // active, maintenance, planned
            $table->json('meta')->nullable(); // Additional data like voltage, pipe diameter
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('infrastructure_lines');
    }
};
