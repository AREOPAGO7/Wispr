<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin; // Make sure to import the Admin model
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // Import Hash facade

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Admin::create([ // Use the imported Admin model directly
            'name' => 'Main Admin', // <-- ADD THIS LINE
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // Use the imported Hash facade
            'email_verified_at' => now(), // Optional: if you want to set it as verified
            'remember_token' => \Illuminate\Support\Str::random(10), // Optional: good practice
        ]);
    }
}