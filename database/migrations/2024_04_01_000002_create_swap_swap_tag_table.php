<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('swap_swap_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swap_id')->constrained()->onDelete('cascade');
            $table->foreignId('swap_tag_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['swap_id', 'swap_tag_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('swap_swap_tag');
    }
}; 