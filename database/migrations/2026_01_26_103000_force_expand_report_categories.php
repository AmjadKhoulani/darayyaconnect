<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Repeating the same logic because the previous migration apparently didn't take effect
        // or was marked as ran without running.
        DB::statement("ALTER TABLE reports MODIFY COLUMN category ENUM('electricity', 'water', 'sanitation', 'safety', 'communication', 'infrastructure', 'other') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No down action to prevent data loss or issues
    }
};
