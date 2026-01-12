<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generators', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('owner_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('neighborhood');
            $table->string('street_address')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->decimal('ampere_price', 10, 2); // السعر بالليرة
            $table->integer('operating_hours')->default(24); // ساعات العمل يومياً
            $table->enum('status', ['active', 'down', 'maintenance'])->default('active');
            $table->timestamp('last_price_update')->nullable();
            $table->timestamps();
            
            $table->index(['neighborhood', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('generators');
    }
};
