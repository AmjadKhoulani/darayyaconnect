<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('author');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->enum('category', ['novel', 'science', 'religious', 'history', 'children', 'cooking', 'self_development', 'other']);
            $table->enum('language', ['arabic', 'english', 'french', 'other'])->default('arabic');
            $table->enum('condition', ['new', 'good', 'acceptable'])->default('good');
            $table->enum('status', ['available', 'borrowed'])->default('available');
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
