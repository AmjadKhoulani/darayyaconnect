<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_states', function (Blueprint $table) {
            $table->id();
            $table->string('service_key')->unique(); // 'electricity', 'water'
            $table->string('name'); // 'الكهرباء', 'المياه'
            $table->string('status_text'); // 'مستقر', 'ضخ', 'مقطوع'
            $table->string('status_color'); // 'emerald', 'red', 'amber'
            $table->string('icon')->default('Zap');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_states');
    }
};
