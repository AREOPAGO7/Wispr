<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('swap_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('swap_tag_pivot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('swap_tags')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('swap_tag_pivot');
        Schema::dropIfExists('swap_tags');
    }
}; 