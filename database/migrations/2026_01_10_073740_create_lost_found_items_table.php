<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lost_found_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['lost', 'found']);
            $table->enum('category', ['documents', 'phone', 'keys', 'bag', 'wallet', 'jewelry', 'pet', 'other']);
            $table->string('title');
            $table->text('description');
            $table->string('location'); // neighborhood name
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->date('date'); // date of loss/found
            $table->json('images')->nullable();
            $table->string('contact_info')->nullable();
            $table->enum('status', ['active', 'resolved'])->default('active');
            $table->timestamps();
            
            $table->index(['type', 'status']);
            $table->index('category');
            $table->index('location');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lost_found_items');
    }
};
