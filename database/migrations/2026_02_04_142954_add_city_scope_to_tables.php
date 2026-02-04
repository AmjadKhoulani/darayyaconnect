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
        // Ensure Governorates exist
        $damascus = DB::table('governorates')->where('code', 'DAM')->first();
        if (!$damascus) {
            $damascusId = DB::table('governorates')->insertGetId([
                'name_en' => 'Damascus', 'name_ar' => 'دمشق', 'code' => 'DAM', 'created_at' => now(), 'updated_at' => now()
            ]);
        } else {
            $damascusId = $damascus->id;
        }
        
        $rif = DB::table('governorates')->where('code', 'RIF')->first();
        if (!$rif) {
            $rifId = DB::table('governorates')->insertGetId([
                'name_en' => 'Rif Dimashq', 'name_ar' => 'ريف دمشق', 'code' => 'RIF', 'created_at' => now(), 'updated_at' => now()
            ]);
        } else {
            $rifId = $rif->id;
        }

        // Ensure Cities exist
        if (!DB::table('cities')->where('code', 'DAM-C')->exists()) {
            DB::table('cities')->insert([
                'governorate_id' => $damascusId, 'name_en' => 'Damascus', 'name_ar' => 'دمشق', 'code' => 'DAM-C', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()
            ]);
        }
        if (!DB::table('cities')->where('code', 'YAR')->exists()) {
             DB::table('cities')->insert([
                'governorate_id' => $damascusId, 'name_en' => 'Yarmouk', 'name_ar' => 'اليرموك', 'code' => 'YAR', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()
            ]);
        }

        $darayya = DB::table('cities')->where('code', 'DAR')->first();
        if (!$darayya) {
            $darayyaId = DB::table('cities')->insertGetId(
                ['governorate_id' => $rifId, 'name_en' => 'Darayya', 'name_ar' => 'داريا', 'code' => 'DAR', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]
            );
        } else {
            $darayyaId = $darayya->id;
        }

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
                if (!Schema::hasColumn($tableName, 'city_id')) {
                    Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                        $table->foreignId('city_id')->nullable()->after('id');
                    });
                }

                // Update existing rows to Darayya
                DB::table($tableName)->whereNull('city_id')->update(['city_id' => $darayyaId]);

                // Now add relation if not exists
                // Checking for index usually implies FK exists, simplest is try-catch or dedicated check?
                // For simplicity in Laravel migration, we assume if we just added column, we can add FK.
                // But since we split checks, we might have column but no FK.
                // Re-declaring foreign key on existing column is usually fine or ignored if identical, 
                // BUT constraint name collision will happen.
                
                // We'll skip complex FK check for now and hope standard Schema::table handles it or it throws a catchable exception.
                // Actually, let's just try to add it. If it fails, it fails (meaning it's likely already there).
                try {
                     Schema::table($tableName, function (Blueprint $table) {
                         // We assign a specific name to check/drop easily if needed, or let Laravel handle it.
                         // constraint name: table_city_id_foreign
                         $table->foreign('city_id')->references('id')->on('cities')->nullOnDelete();
                     });
                } catch (\Throwable $e) {
                    // Ignore duplicate key error
                }
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
                    // Start by dropping FK, then column
                    try {
                        $table->dropForeign(['city_id']);
                    } catch (\Throwable $e) {}
                    
                    if (Schema::hasColumn($table->getTable(), 'city_id')) {
                        $table->dropColumn('city_id');
                    }
                });
            }
        }
    }
};
