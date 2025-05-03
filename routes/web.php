<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/deals', function () {
    return Inertia::render('deals');
})->name('deals');

Route::get('/chat', function () {
    return Inertia::render('chat');
})->name('chat');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::get('home', function () {
        return Inertia::render('home');
    })->name('home');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
