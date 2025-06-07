<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public admin routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    
    // Protected admin routes
    Route::middleware(['admin.auth'])->group(function () {
        // Auth routes
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
        
        // Users management
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/users/{user}', [AdminController::class, 'getUser']);
        Route::put('/users/{user}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
        
        // Swaps management
        Route::get('/swaps', [AdminController::class, 'getSwaps']);
        Route::get('/swaps/{swap}', [AdminController::class, 'getSwap']);
        Route::put('/swaps/{swap}', [AdminController::class, 'updateSwap']);
        Route::delete('/swaps/{swap}', [AdminController::class, 'deleteSwap']);
        
        // Deals management
        Route::get('/deals', [AdminController::class, 'getDeals']);
        Route::get('/deals/{deal}', [AdminController::class, 'getDeal']);
        Route::put('/deals/{deal}', [AdminController::class, 'updateDeal']);
        
        // Comments management
        Route::get('/comments', [AdminController::class, 'getComments']);
        Route::delete('/comments/{comment}', [AdminController::class, 'deleteComment']);
        
        // Messages management
        Route::get('/messages', [AdminController::class, 'getMessages']);
        Route::delete('/messages/{message}', [AdminController::class, 'deleteMessage']);
    });
});

// Regular API routes
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});