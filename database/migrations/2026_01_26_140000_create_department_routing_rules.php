<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create Routing Rules Table
        Schema::create('department_routing_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('category')->nullable(); // e.g., 'water', 'electricity'
            $table->string('infrastructure_type')->nullable(); // e.g., 'transformer', 'pump'
            $table->timestamps();
        });

        // 2. Seed Default Departments
        $departments = [
            ['name' => 'مجلس مدينة داريا', 'slug' => 'council'],
            ['name' => 'وحدة مياه داريا', 'slug' => 'water'],
            ['name' => 'طوارئ الكهرباء', 'slug' => 'electricity'],
            ['name' => 'مستوصف داريا الصحي', 'slug' => 'health'],
        ];

        foreach ($departments as $dept) {
            DB::table('departments')->updateOrInsert(
                ['slug' => $dept['slug']],
                ['name' => $dept['name'], 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // 3. Seed Default Routing Rules
        $deptIds = DB::table('departments')->pluck('id', 'slug');

        $rules = [
            // Electricity
            ['department_id' => $deptIds['electricity'], 'category' => 'electricity', 'infrastructure_type' => null],
            ['department_id' => $deptIds['electricity'], 'category' => 'lighting', 'infrastructure_type' => null],
            ['department_id' => $deptIds['electricity'], 'category' => null, 'infrastructure_type' => 'transformer'],
            
            // Water
            ['department_id' => $deptIds['water'], 'category' => 'water', 'infrastructure_type' => null],
            ['department_id' => $deptIds['water'], 'category' => 'sanitation', 'infrastructure_type' => null],
            
            // Council (General)
            ['department_id' => $deptIds['council'], 'category' => 'road', 'infrastructure_type' => null],
            ['department_id' => $deptIds['council'], 'category' => 'infrastructure', 'infrastructure_type' => null],
            ['department_id' => $deptIds['council'], 'category' => 'other', 'infrastructure_type' => null],
        ];

        foreach ($rules as $rule) {
            if ($rule['department_id']) {
                DB::table('department_routing_rules')->insert(array_merge($rule, [
                    'created_at' => now(),
                    'updated_at' => now()
                ]));
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('department_routing_rules');
    }
};
