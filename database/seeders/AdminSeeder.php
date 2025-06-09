<?php

namespace Database\Seeders;

use App\Models\Admin; // Import your Admin model
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // For hashing passwords
use Illuminate\Support\Str; // For generating random strings (like remember_token)

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Example 1: Create a single admin user
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'email_verified_at' => now(), // Set the verification timestamp to now
            'password' => Hash::make('password'), // Hash the password
            'remember_token' => Str::random(10), // Generate a random remember token
        ]);

        // Example 2: Create another admin user (optional)
        Admin::create([
            'name' => 'Test Admin',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ]);

        // Example 3: Create multiple admins using a loop (optional)
        // \App\Models\Admin::factory()->count(5)->create();
        // ^ This requires a factory for the Admin model.
        // If you need many dummy admins, consider creating an AdminFactory first.
    }
}