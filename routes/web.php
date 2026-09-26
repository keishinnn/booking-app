<?php

use App\Http\Controllers\Admin\AdministratorController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\Admin\TableController as AdminTableController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Guest\ReservationController as GuestReservationController;
use App\Http\Controllers\Guest\ReserveAvailabilityController;
use App\Http\Controllers\Guest\ReserveController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Staff\DashboardController as StaffDashboardController;
use App\Http\Controllers\Staff\ReservationController as StaffReservationController;
use App\Http\Controllers\Staff\TableController as StaffTableController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');
Route::inertia('/terms', 'terms')->name('terms');
Route::inertia('/privacy', 'privacy')->name('privacy');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::redirect('/', '/staff/dashboard');
    Route::get('/dashboard', StaffDashboardController::class)->name('dashboard');
    Route::get('/tables', StaffTableController::class)->name('tables');

    Route::get('/reservations', [StaffReservationController::class, 'index'])->name('reservations');
    Route::get('/reservations/create', [StaffReservationController::class, 'create'])->name('reservations.create');
    Route::post('/reservations', [StaffReservationController::class, 'store'])->name('reservations.store');
    Route::post('/reservations/walk-in', [StaffReservationController::class, 'walkIn'])->name('reservations.walk-in');
    Route::post('/reservations/{reservation}/seat', [StaffReservationController::class, 'seat'])->name('reservations.seat');
    Route::post('/reservations/{reservation}/complete', [StaffReservationController::class, 'complete'])->name('reservations.complete');
    Route::post('/reservations/{reservation}/no-show', [StaffReservationController::class, 'noShow'])->name('reservations.no-show');
    Route::get('/reservations/{reservation}/edit', [StaffReservationController::class, 'edit'])->name('reservations.edit');
    Route::match(['put', 'patch'], '/reservations/{reservation}', [StaffReservationController::class, 'update'])->name('reservations.update');
    Route::delete('/reservations/{reservation}', [StaffReservationController::class, 'destroy'])->name('reservations.destroy');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');
    Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
    Route::resource('tables', AdminTableController::class)->except(['show']);
    Route::resource('staff', AdminStaffController::class)->except(['show']);
    Route::resource('admins', AdministratorController::class)->except(['show']);
});

Route::get('/reserve', ReserveController::class)->name('reserve');
Route::get('/reserve/availability', ReserveAvailabilityController::class)->name('reserve.availability');
Route::post('/reservations', [GuestReservationController::class, 'store'])->name('reservations.store');
Route::get('/reservations/{reservation}/confirmation', [GuestReservationController::class, 'confirmation'])
    ->name('reservations.confirmation');
