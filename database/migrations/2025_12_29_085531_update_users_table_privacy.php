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
        Schema::table('users', function (Blueprint $table) {
            // Drop invasive fields if they exist
            if (Schema::hasColumn('users', 'phone_number')) {
                $table->dropColumn('phone_number');
            }
            if (Schema::hasColumn('users', 'national_id')) {
                $table->dropColumn('national_id');
            }
            
            // Add demographic fields
            $table->integer('age')->nullable()->after('email');
            $table->string('gender')->nullable()->after('age'); // male, female
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number')->nullable();
            $table->string('national_id')->nullable();
            $table->dropColumn(['age', 'gender']);
        });
    }
};
