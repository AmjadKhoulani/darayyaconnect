<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add moderation_status to community tables
        $tables = [
            'initiatives',
            'discussions',
            'books',
            'volunteer_opportunities',
            'lost_found_items',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    // Check if column doesn't exist already (some might have status but not moderation_status)
                    if (!Schema::hasColumn($table->getTable(), 'moderation_status')) {
                        $table->string('moderation_status')->default('pending')->after('id');
                        $table->index('moderation_status');
                    }
                });
            }
        }

        // Create forbidden_words table
        Schema::create('forbidden_words', function (Blueprint $table) {
            $table->id();
            $table->string('word')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forbidden_words');

        $tables = [
            'initiatives',
            'discussions',
            'books',
            'volunteer_opportunities',
            'lost_found_items',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    if (Schema::hasColumn($table->getTable(), 'moderation_status')) {
                        $table->dropColumn('moderation_status');
                    }
                });
            }
        }
    }
};
