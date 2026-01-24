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
        Schema::table('infrastructure_nodes', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('status');
        });

        Schema::table('infrastructure_lines', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('infrastructure_nodes', function (Blueprint $table) {
            $table->dropColumn('is_published');
        });

        Schema::table('infrastructure_lines', function (Blueprint $table) {
            $table->dropColumn('is_published');
        });
    }
};
