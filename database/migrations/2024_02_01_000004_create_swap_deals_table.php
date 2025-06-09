<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('swap_deals', function (Blueprint $table) {
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
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('swap_deals');
    }
}; 