<?php

use App\Http\Controllers\Admin\AddressController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\FieldController;
use App\Http\Controllers\Admin\NationalityController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\ReservationController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Middleware\RoleCheck;
use Illuminate\Support\Facades\Route;

//Without authentication
Route::name('api.')->group(function () {
    Route::post('register', [AuthenticationController::class, 'register'])->name('register');
    Route::post('login', [AuthenticationController::class, 'login'])->name('login');
    Route::get('fields', [FieldController::class, 'index'])->name('fields');
});

//With authentication
Route::middleware('auth:api')->group(function () {
    Route::get('user', [AuthenticationController::class, 'userInfo']);
    Route::post('logout', [AuthenticationController::class, 'logout']);
    Route::get('/fields/search/{name?}', [FieldController::class, 'search']);
    Route::get('fields/{id}', [FieldController::class, 'show']);
    Route::apiResource('reservations', ReservationController::class);
    Route::get('reservations/search/{reservation?}', [ReservationController::class, 'search']);
    Route::get('/reservations/deleted', [ReservationController::class, 'indexDeleted']);
});

//With authentication and role check
Route::middleware('auth:api')->group(function () {
    Route::apiResource('fields', FieldController::class)
        ->except(['index', 'show'])
        ->middleware(RoleCheck::class);
    Route::apiResource('addresses', AddressController::class)
        ->middleware(RoleCheck::class);
    Route::apiResource('payments', PaymentController::class)
        ->middleware(RoleCheck::class);
    Route::get('/payments/search/{payment?}', [PaymentController::class, 'search'])
        ->middleware(RoleCheck::class);
    Route::apiResource('payment-methods', PaymentMethodController::class)
        ->middleware(RoleCheck::class);
    Route::get('/payment-methods/search/{description?}', [PaymentMethodController::class, 'search'])
        ->middleware(RoleCheck::class);
    Route::get('/addresses/search/{address?}', [AddressController::class, 'search'])
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
    Route::get('users', [UserController::class, 'index'])
        ->middleware(RoleCheck::class);
    Route::apiResource('clients', ClientController::class)
        ->middleware(RoleCheck::class);
    Route::get('/clients/search/{name?}', [ClientController::class, 'search'])
        ->middleware(RoleCheck::class);

});