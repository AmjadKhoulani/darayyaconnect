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
        $tables = [
            'reports',
            'infrastructure_points',
            'infrastructure_lines',
            'infrastructure_nodes',
            'initiatives',
            'service_logs',
            'sos_alerts',
            'discussions',
            'lost_found_items',
            'books',
            'volunteer_opportunities',
            'projects',
            'directory_contacts',
            'directory_items'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    // Default to Darayya (ID: 3) for existing data
                    $table->foreignId('city_id')->nullable()->default(3)->constrained()->nullOnDelete();
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'reports',
            'infrastructure_points',
            'infrastructure_lines',
            'infrastructure_nodes',
            'initiatives',
            'service_logs',
            'sos_alerts',
            'discussions',
            'lost_found_items',
            'books',
            'volunteer_opportunities',
            'projects',
            'directory_contacts',
            'directory_items'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->dropForeign(['city_id']);
                    $table->dropColumn('city_id');
                });
            }
        }
    }
};
