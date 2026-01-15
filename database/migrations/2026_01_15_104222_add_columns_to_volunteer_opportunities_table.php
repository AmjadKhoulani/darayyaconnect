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
        Schema::table('volunteer_opportunities', function (Blueprint $table) {
            $table->string('organization')->after('title')->nullable();
            $table->dateTime('start_date')->after('time_commitment')->nullable();
            $table->dateTime('end_date')->after('start_date')->nullable();
            $table->integer('spots_total')->default(0)->after('end_date');
            $table->integer('spots_filled')->default(0)->after('spots_total');
            $table->string('image')->nullable()->after('spots_filled');
            $table->json('tags')->nullable()->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('volunteer_opportunities', function (Blueprint $table) {
            $table->dropColumn(['organization', 'start_date', 'end_date', 'spots_total', 'spots_filled', 'image', 'tags']);
        });
    }
};
