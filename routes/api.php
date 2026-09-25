<?php

use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\TableController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:staff'])->name('api.')->group(function () {
    Route::get('tables', [TableController::class, 'index'])->name('tables.index');
    Route::get('tables/{table}', [TableController::class, 'show'])->name('tables.show');

    Route::get('reservations', [ReservationController::class, 'index'])->name('reservations.index');
    Route::get('reservations/{reservation}', [ReservationController::class, 'show'])->name('reservations.show');
    Route::post('reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::match(['put', 'patch'], 'reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');
    Route::delete('reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');
});

Route::middleware(['auth', 'role:admin'])->name('api.')->group(function () {
    Route::post('tables', [TableController::class, 'store'])->name('tables.store');
    Route::match(['put', 'patch'], 'tables/{table}', [TableController::class, 'update'])->name('tables.update');
    Route::delete('tables/{table}', [TableController::class, 'destroy'])->name('tables.destroy');
});
