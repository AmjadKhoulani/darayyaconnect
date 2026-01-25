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
        // MySQL doesn't support adding enum values easily with Schema, so we use raw SQL
        DB::statement("ALTER TABLE reports MODIFY COLUMN category ENUM('electricity', 'water', 'sanitation', 'safety', 'communication', 'infrastructure', 'other') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE reports MODIFY COLUMN category ENUM('electricity', 'water', 'sanitation', 'safety') NOT NULL");
    }
};
