<?php

use App\Http\Controllers\Api\TableController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:staff'])->group(function () {
    Route::get('tables', [TableController::class, 'index'])->name('tables.index');
    Route::get('tables/{table}', [TableController::class, 'show'])->name('tables.show');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::post('tables', [TableController::class, 'store'])->name('tables.store');
    Route::put('tables/{table}', [TableController::class, 'update'])->name('tables.update');
    Route::patch('tables/{table}', [TableController::class, 'update']);
    Route::delete('tables/{table}', [TableController::class, 'destroy'])->name('tables.destroy');
});
