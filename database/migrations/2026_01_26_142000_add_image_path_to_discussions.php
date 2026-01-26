<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('discussions', function (Blueprint $table) {
            if (!Schema::hasColumn('discussions', 'image_path')) {
                $table->string('image_path')->nullable()->after('category');
            }
        });

        Schema::table('discussion_replies', function (Blueprint $table) {
            if (!Schema::hasColumn('discussion_replies', 'image_path')) {
                $table->string('image_path')->nullable()->after('body');
            }
        });
    }

    public function down(): void
    {
        Schema::table('discussions', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });

        Schema::table('discussion_replies', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
    }
};
