<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use App\Http\Controllers\SwapController;
use App\Http\Controllers\SwapCommentController;
use App\Http\Controllers\ProfileController;

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
    Route::get('home', [SwapController::class, 'index'])->name('home');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Swap routes
    Route::resource('swaps', SwapController::class);
    Route::post('swaps/{swap:uid}/like', [SwapController::class, 'like'])->name('swaps.like');
    Route::post('swaps/{swap:uid}/dislike', [SwapController::class, 'dislike'])->name('swaps.dislike');
    Route::post('swaps/{swap:uid}/repost', [SwapController::class, 'repost'])->name('swaps.repost');
    Route::post('swaps/{swap:uid}/save', [SwapController::class, 'save'])->name('swaps.save');
    Route::post('swaps/{swap:id}/accept', [SwapController::class, 'accept'])->name('swaps.accept');
    Route::post('swaps/{swap:id}/complete', [SwapController::class, 'complete'])->name('swaps.complete');
    Route::post('swaps/{swap:id}/report', [SwapController::class, 'report'])->name('swaps.report');
    
    // Comment routes
    Route::post('swaps/{swap:id}/comments', [SwapController::class, 'storeComment'])->name('swaps.comments.store');
    Route::delete('swaps/{swap:id}/comments/{comment}', [SwapController::class, 'destroyComment'])->name('swaps.comments.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
