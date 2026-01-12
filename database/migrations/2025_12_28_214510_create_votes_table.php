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
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Polymorphic relation (Vote on Post, Project, etc.)
            $table->morphs('votable'); // Creates votable_id and votable_type
            
            $table->unsignedBigInteger('option_id')->nullable(); // For Polls with specific options
            $table->integer('value')->default(1); // 1 = Upvote, -1 = Downvote
            $table->json('metadata')->nullable();
            
            $table->timestamps();

            // Prevent double voting
            $table->unique(['user_id', 'votable_type', 'votable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
