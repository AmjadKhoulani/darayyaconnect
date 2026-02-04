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
        // 1. Seed Minimal Data Required for Foreign Keys
        // We need 'Darayya' to be ID 3 to match our default assumptions, or simply insert it and get the ID.
        // Determining ID 3 reliance: The previous attempt hardcoded default(3). 
        // We will stick to that structure to ensure consistency if the user already ran this partially.
        
        // Ensure Governorates exist
        $damascusId = DB::table('governorates')->insertGetId([
            'name_en' => 'Damascus', 'name_ar' => 'دمشق', 'code' => 'DAM', 'created_at' => now(), 'updated_at' => now()
        ]); // ID likely 1
        
        $rifId = DB::table('governorates')->insertGetId([
            'name_en' => 'Rif Dimashq', 'name_ar' => 'ريف دمشق', 'code' => 'RIF', 'created_at' => now(), 'updated_at' => now()
        ]); // ID likely 2

        // Ensure Cities exist (Matches Seeder Order to try and hit ID 3 for Darayya)
        DB::table('cities')->insert([
            ['governorate_id' => $damascusId, 'name_en' => 'Damascus', 'name_ar' => 'دمشق', 'code' => 'DAM-C', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // 1
            ['governorate_id' => $damascusId, 'name_en' => 'Yarmouk', 'name_ar' => 'اليرموك', 'code' => 'YAR', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()], // 2
        ]);

        $darayyaId = DB::table('cities')->insertGetId(
            ['governorate_id' => $rifId, 'name_en' => 'Darayya', 'name_ar' => 'داريا', 'code' => 'DAR', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]
        ); // Should be 3 if table was empty.

        // Fallback: If for some reason auto-increment was not 3 (e.g. table wasn't empty), use the actual ID.
        // However, schema definition requires a constant for default().
        // We will use the retrieved ID if possible, but default() in Blueprint takes a literal.
        // So we will add the column nullable first, update it, then constrain. This is safer.

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
                    // Add column as nullable first, no default constraint yet
                    $table->foreignId('city_id')->nullable()->after('id');
                });

                // Update existing rows to Darayya
                DB::table($tableName)->update(['city_id' => $darayyaId]);

                // Now add relation
                Schema::table($tableName, function (Blueprint $table) {
                     // We can't easily change to not-null with foreign key in one go on SQLite/some drivers,
                     // but for MySQL it's fine.
                     // However, keeping it nullable is fine as 'global' items might exist.
                     $table->foreign('city_id')->references('id')->on('cities')->nullOnDelete();
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
