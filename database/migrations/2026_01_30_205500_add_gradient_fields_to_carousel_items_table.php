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
        Schema::table('carousel_items', function (Blueprint $table) {
            $table->string('image_type')->default('upload')->after('image_path'); // 'upload' or 'gradient'
            $table->string('gradient')->nullable()->after('image_type'); // e.g., 'from-blue-500 to-indigo-600'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carousel_items', function (Blueprint $table) {
            $table->dropColumn(['image_type', 'gradient']);
        });
    }
};
