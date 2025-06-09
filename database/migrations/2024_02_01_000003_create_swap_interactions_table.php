<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('swap_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('swap_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['like', 'repost', 'save']);
            $table->timestamps();

            $table->unique(['user_id', 'swap_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('swap_interactions');
    }
}; 