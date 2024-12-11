<?php

use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\FieldController;
use App\Http\Controllers\Admin\NationalityController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\ReservationController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\CancellationController;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Middleware\RoleCheck;
use Illuminate\Support\Facades\Route;

// Without authentication
Route::name('api.')->group(function () {
    Route::post('register', [AuthenticationController::class, 'register'])->name('register');
    Route::post('login', [AuthenticationController::class, 'login'])->name('login');
    Route::get('fields', [FieldController::class, 'publicIndex']);
    Route::get('/fields/search/{name?}', [FieldController::class, 'search']);
});

// With authentication
Route::middleware('auth:api')->group(function () {
    Route::get('user', [AuthenticationController::class, 'userInfo']);
    Route::post('logout', [AuthenticationController::class, 'logout']);
    Route::put('user/update-password', [UserController::class, 'updatePassword']);

    Route::apiResource('clients', ClientController::class);
    Route::get('/clients/search/{name?}', [ClientController::class, 'search']);

    // Routes for fields
    Route::get('fields/restricted', [FieldController::class, 'roleBasedIndex']); // Role-based access
    Route::apiResource('fields', FieldController::class)->except(['index', 'publicIndex', 'roleBasedIndex']);
    Route::get('fields/{id}', [FieldController::class, 'show']); // View specific field details

    // Specific routes for reservations
    Route::get('reservations/check-availability', [ReservationController::class, 'checkAvailability']);
    Route::get('reservations/', [ReservationController::class, 'search']);
    Route::get('reservations/search/{reservation?}', [ReservationController::class, 'search']);

    // Generic resource routes
    Route::get('reservations/{reservationId}', [ReservationController::class, 'show']);
    Route::apiResource('reservations', ReservationController::class)->except(['show']);
    Route::apiResource('cancellations', CancellationController::class);
    Route::delete('reservations/{reservationId}', [ReservationController::class, 'destroy']);

    // Cart routes
    Route::post('/cart/add', [ReservationController::class, 'addCart']);
    Route::post('/cart/remove', [ReservationController::class, 'removeFromCart']);
    Route::get('/cart/view', [ReservationController::class, 'viewCart']);

    // Payment routes
    Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/payment-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/setup-intent', [PaymentController::class, 'createSetupIntent']);
	Route::post('/payments/process-payment', [PaymentController::class, 'processPayment']);
    Route::post('/payment-intent/{id}/confirm', [PaymentController::class, 'confirmPaymentIntent']);
    Route::get('/payment-intent/{id}', [PaymentController::class, 'showPaymentIntent']);

    // Nationalities route
    Route::apiResource('/nationalities', NationalityController::class);

    // Promotions
    Route::get('promotions', [PromotionController::class, 'index']);
});

// With authentication and role check
Route::middleware(['auth:api', RoleCheck::class])->group(function () {
    Route::apiResource('payments', PaymentController::class);
    Route::get('/payments/search/{payment?}', [PaymentController::class, 'search']);
    Route::apiResource('payment-methods', PaymentMethodController::class);
    Route::get('/payment-methods/search/{description?}', [PaymentMethodController::class, 'search']);
    Route::apiResource('companies', CompanyController::class);
    Route::get('/companies/search/{name?}', [CompanyController::class, 'search']);
    Route::apiResource('roles', RoleController::class);
    Route::get('/roles/search/{name?}', [RoleController::class, 'search']);
    Route::apiResource('users', UserController::class);
    Route::post('promotions', [PromotionController::class, 'create']);
    Route::get('/promotions/search/{string?}', [PromotionController::class, 'search']);
    // Payment setup and processing
    Route::post('/payment/setup-intent', [PaymentController::class, 'createSetupIntent']);
    Route::post('/payment/process', [PaymentController::class, 'processPayment']);
});
