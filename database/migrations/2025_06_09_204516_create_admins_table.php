<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('name'); // Admin's name
            $table->string('email')->unique(); // Admin's email, must be unique
            $table->timestamp('email_verified_at')->nullable(); // For email verification
            $table->string('password'); // Hashed password
            $table->rememberToken(); // For "remember me" functionality
            $table->timestamps(); // created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};