<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Create a temporary table with the new enum
        Schema::create('swap_interactions_new', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('swap_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['like', 'repost', 'save', 'dislike']);
            $table->timestamps();

            $table->unique(['user_id', 'swap_id', 'type']);
        });

        // Copy data from old table to new table
        DB::statement('INSERT INTO swap_interactions_new SELECT * FROM swap_interactions');

        // Drop the old table
        Schema::drop('swap_interactions');

        // Rename the new table to the original name
        Schema::rename('swap_interactions_new', 'swap_interactions');
    }

    public function down(): void
    {
        // Create a temporary table with the old enum
        Schema::create('swap_interactions_old', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('swap_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['like', 'repost', 'save']);
            $table->timestamps();

            $table->unique(['user_id', 'swap_id', 'type']);
        });

        // Copy data from new table to old table, excluding 'dislike' entries
        DB::statement("INSERT INTO swap_interactions_old SELECT * FROM swap_interactions WHERE type != 'dislike'");

        // Drop the new table
        Schema::drop('swap_interactions');

        // Rename the old table back to the original name
        Schema::rename('swap_interactions_old', 'swap_interactions');
    }
}; 