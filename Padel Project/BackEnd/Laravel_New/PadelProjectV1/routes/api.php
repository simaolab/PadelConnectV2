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
use App\Http\Controllers\Admin\CancellationController;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Middleware\RoleCheck;
use Illuminate\Support\Facades\Route;

//Without authentication
Route::name('api.')->group(function () {
    Route::post('register', [AuthenticationController::class, 'register'])->name('register');
    Route::post('login', [AuthenticationController::class, 'login'])->name('login');
    Route::get('fields', [FieldController::class, 'index'])->name('fields');
    Route::get('/fields/search/{name?}', [FieldController::class, 'search']);
});

//With authentication
Route::middleware('auth:api')->group(function () {
    Route::get('user', [AuthenticationController::class, 'userInfo']);
    Route::post('logout', [AuthenticationController::class, 'logout']);
    Route::put('user/update-password', [UserController::class, 'updatePassword']);
    Route::get('fields/{id}', [FieldController::class, 'show']);
    Route::apiResource('reservations', ReservationController::class);
    Route::get('reservations/search/{reservation?}', [ReservationController::class, 'search']);
    Route::get('/reservations/deleted', [ReservationController::class, 'indexDeleted']);
    Route::apiResource('cancellations', CancellationController::class);


    // STRIPE ROUTES
    Route::post('/payment-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/setup-intent', [PaymentController::class, 'createSetupIntent']);
    Route::post('/process-payment', [PaymentController::class, 'processPayment']);
    Route::post('/payment-intent/{id}/confirm', [PaymentController::class, 'confirmPaymentIntent']);
    Route::get('/payment-intent/{id}', [PaymentController::class, 'showPaymentIntent']);
    // END STRIPE ROUTES

});

//With authentication and role check
Route::middleware('auth:api')->group(function () {
    Route::apiResource('fields', FieldController::class)
        ->except(['index', 'show'])
        ->middleware(RoleCheck::class);
    Route::apiResource('payments', PaymentController::class)
        ->middleware(RoleCheck::class);
    Route::get('/payments/search/{payment?}', [PaymentController::class, 'search'])
        ->middleware(RoleCheck::class);
    Route::apiResource('payment-methods', PaymentMethodController::class)
        ->middleware(RoleCheck::class);
    Route::get('/payment-methods/search/{description?}', [PaymentMethodController::class, 'search'])
        ->middleware(RoleCheck::class);
    Route::apiResource('companies', CompanyController::class)
        ->middleware(RoleCheck::class);
    Route::get('/companies/search/{name?}', [CompanyController::class, 'search'])
        ->middleware(RoleCheck::class);
    Route::apiResource('nationalities', NationalityController::class)
        ->middleware(RoleCheck::class);
    Route::get('/nationalities/search/{name?}', [NationalityController::class, 'search'])
        ->middleware(RoleCheck::class);
    Route::apiResource('roles', RoleController::class)
        ->middleware(RoleCheck::class);
    Route::get('/roles/search/{name?}', [RoleController::class, 'search'])
        ->middleware(RoleCheck::class);
    Route::apiResource('users', UserController::class)
        ->middleware(RoleCheck::class);
    Route::apiResource('clients', ClientController::class)
        ->middleware(RoleCheck::class);
    Route::get('/clients/search/{name?}', [ClientController::class, 'search'])
        ->middleware(RoleCheck::class);
    Route::apiResource('promotions', PromotionController::class)
        ->middleware(RoleCheck::class);
    Route::get('/promotions/search/{string?}', [PromotionController::class, 'search'])
        ->middleware(RoleCheck::class);

    Route::post('/payment/setup-intent', [PaymentController::class, 'createSetupIntent']);
    Route::post('/payment/process', [PaymentController::class, 'processPayment']);
    
});

Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])
    ->middleware('verify.stripe.signature');