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
        Schema::table('ai_studies', function (Blueprint $table) {
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->string('gradient')->nullable();
            $table->text('summary')->nullable();
            $table->json('scenario')->nullable();
            $table->json('economics')->nullable();
            $table->json('environmental')->nullable();
            $table->json('social')->nullable();
            $table->json('implementation')->nullable();
            $table->json('risks')->nullable();
            $table->json('recommendations')->nullable();
            $table->json('technical_details')->nullable();
            
            $table->text('content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_studies', function (Blueprint $table) {
            $table->dropColumn([
                'icon', 'color', 'gradient', 'summary',
                'scenario', 'economics', 'environmental', 'social',
                'implementation', 'risks', 'recommendations', 'technical_details'
            ]);
        });
    }
};
