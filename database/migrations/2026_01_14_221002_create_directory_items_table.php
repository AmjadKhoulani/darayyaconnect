<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('icon')->nullable(); // Lucide icon name or image URL
            $table->string('type'); // 'official', 'company', 'emergency'
            $table->string('category')->nullable(); // 'internet', 'health', 'security'
            $table->text('description')->nullable();
            $table->decimal('rating', 3, 2)->nullable(); // e.g. 4.5
            $table->json('metadata')->nullable(); // For extra fields: speed, hours, etc.
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directory_items');
    }
};
