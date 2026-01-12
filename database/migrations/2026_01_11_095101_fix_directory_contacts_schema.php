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
        Schema::table('directory_contacts', function (Blueprint $table) {
            $table->decimal('rating', 3, 1)->default(5.0)->after('category');
            $table->renameColumn('address', 'location');
        });
    }

    public function down(): void
    {
        Schema::table('directory_contacts', function (Blueprint $table) {
            $table->dropColumn('rating');
            $table->renameColumn('location', 'address');
        });
    }
};
