<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // First, create a new table with the updated enum
        Schema::create('swap_deals_temp', function ($table) {
            $table->id();
            $table->foreignId('swap_id')->constrained()->onDelete('cascade');
            $table->foreignId('initiator_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('acceptor_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['pending', 'in_progress', 'completed', 'reported', 'cancelled'])->default('pending');
            $table->text('initiator_rating')->nullable();
            $table->text('acceptor_rating')->nullable();
            $table->integer('initiator_rating_score')->nullable();
            $table->integer('acceptor_rating_score')->nullable();
            $table->text('report_reason')->nullable();
            $table->boolean('initiator_accepted')->default(false);
            $table->boolean('acceptor_accepted')->default(false);
            $table->timestamps();
        });

        // Copy data from old table to new table
        DB::statement('INSERT INTO swap_deals_temp SELECT * FROM swap_deals');

        // Drop old table
        Schema::drop('swap_deals');

        // Rename new table
        Schema::rename('swap_deals_temp', 'swap_deals');
    }

    public function down()
    {
        // Recreate the original table structure if needed
        Schema::create('swap_deals_temp', function ($table) {
            $table->id();
            $table->foreignId('swap_id')->constrained()->onDelete('cascade');
            $table->foreignId('initiator_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('acceptor_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['pending', 'in_progress', 'completed', 'reported'])->default('pending');
            $table->text('initiator_rating')->nullable();
            $table->text('acceptor_rating')->nullable();
            $table->integer('initiator_rating_score')->nullable();
            $table->integer('acceptor_rating_score')->nullable();
            $table->text('report_reason')->nullable();
            $table->boolean('initiator_accepted')->default(false);
            $table->boolean('acceptor_accepted')->default(false);
            $table->timestamps();
        });

        // Copy data back, excluding any rows with 'cancelled' status
        DB::statement("INSERT INTO swap_deals_temp SELECT * FROM swap_deals WHERE status != 'cancelled'");
        
        // Drop the table with cancelled status
        Schema::drop('swap_deals');
        
        // Rename back
        Schema::rename('swap_deals_temp', 'swap_deals');
    }
};
