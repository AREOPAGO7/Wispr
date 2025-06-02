<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use App\Http\Controllers\SwapController;
use App\Http\Controllers\SwapCommentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SwapDealController;
use App\Http\Controllers\DealMessageController;
use App\Http\Controllers\MySwapController;

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

    // Deal routes
    Route::get('/deals', [SwapDealController::class, 'index'])->name('deals.index');
    Route::post('/swaps/{swap:uid}/deals', [SwapDealController::class, 'store'])->name('deals.store');
    Route::get('/deals/{deal}', [SwapDealController::class, 'show'])->name('deals.show');
    Route::post('/deals/{deal}/accept', [SwapDealController::class, 'accept'])->name('deals.accept');
    Route::post('/deals/{deal}/reject', [SwapDealController::class, 'reject'])->name('deals.reject');
    Route::post('/deals/{deal}/complete', [SwapDealController::class, 'complete'])->name('deals.complete');
    Route::post('/deals/{deal}/report', [SwapDealController::class, 'report'])->name('deals.report');
    Route::post('/deals/{deal}/rate', [SwapDealController::class, 'rate'])->name('deals.rate');
    Route::post('/deals/{deal}/messages', [DealMessageController::class, 'store'])->name('deals.messages.store');
    Route::get('/deals/{deal}/messages', [DealMessageController::class, 'index'])->name('deals.messages.index');
});

// My Swaps routes
    Route::prefix('my-swaps')->name('my-swaps.')->group(function () {
        Route::get('/', [MySwapController::class, 'index'])->name('index');
        Route::get('/create', [MySwapController::class, 'create'])->name('create');
        Route::post('/', [MySwapController::class, 'store'])->name('store');
        Route::get('/{swap}', [MySwapController::class, 'show'])->name('show');
        Route::get('/{swap}/edit', [MySwapController::class, 'edit'])->name('edit');
        Route::put('/{swap}', [MySwapController::class, 'update'])->name('update');
        Route::delete('/{swap}', [MySwapController::class, 'destroy'])->name('destroy');
    });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
