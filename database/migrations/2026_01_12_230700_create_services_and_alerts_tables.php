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
        if (!Schema::hasTable('services')) {
            Schema::create('services', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('status')->default('on'); // on, off, warning
                $table->string('details')->nullable();
                $table->string('icon')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('service_alerts')) {
            Schema::create('service_alerts', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('body');
                $table->string('type')->default('info'); // info, warning, danger
                $table->timestamp('expires_at')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('posts')) {
            Schema::create('posts', function (Blueprint $table) {
                $table->id();
                $table->string('author_name');
                $table->string('role')->nullable();
                $table->string('type')->default('announcement'); // announcement, poll
                $table->text('content');
                $table->string('image_url')->nullable();
                $table->integer('likes_count')->default(0);
                $table->integer('comments_count')->default(0);
                $table->json('metadata')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
        Schema::dropIfExists('service_alerts');
        Schema::dropIfExists('services');
    }
};
