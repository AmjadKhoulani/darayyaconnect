<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('infrastructure_nodes', function (Blueprint $table) {
            $table->string('serial_number')->nullable()->unique()->after('type');
        });

        Schema::table('infrastructure_lines', function (Blueprint $table) {
            $table->string('serial_number')->nullable()->after('type'); // unique might be tricky for lines if same ID used across segments, so nullable for now
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->unsignedBigInteger('infrastructure_node_id')->nullable()->after('status');
            $table->unsignedBigInteger('infrastructure_line_id')->nullable()->after('infrastructure_node_id');
            
            $table->foreign('infrastructure_node_id')->references('id')->on('infrastructure_nodes')->onDelete('set null');
            $table->foreign('infrastructure_line_id')->references('id')->on('infrastructure_lines')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeign(['infrastructure_node_id']);
            $table->dropForeign(['infrastructure_line_id']);
            $table->dropColumn(['infrastructure_node_id', 'infrastructure_line_id']);
        });

        Schema::table('infrastructure_lines', function (Blueprint $table) {
            $table->dropColumn('serial_number');
        });

        Schema::table('infrastructure_nodes', function (Blueprint $table) {
            $table->dropColumn('serial_number');
        });
    }
};
