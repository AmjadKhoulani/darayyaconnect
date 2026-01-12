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
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // water, electricity, municipality
            $table->timestamps();
        });

        // Add department_id to reports
        if (Schema::hasTable('reports')) {
            Schema::table('reports', function (Blueprint $table) {
                $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            });
        }

        // Add department_id to service_logs
        if (Schema::hasTable('service_logs')) {
            Schema::table('service_logs', function (Blueprint $table) {
                $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments_and_update_reports');
    }
};
