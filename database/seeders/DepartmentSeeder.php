<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'مؤسسة المياه', 'slug' => 'water'],
            ['name' => 'شركة الكهرباء', 'slug' => 'electricity'],
            ['name' => 'بلدية داريا', 'slug' => 'municipality'],
            ['name' => 'الهاتف والأتصالات', 'slug' => 'telecom'],
        ];

        foreach ($departments as $dept) {
            DB::table('departments')->updateOrInsert(
                ['slug' => $dept['slug']],
                ['name' => $dept['name'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
