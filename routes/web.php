<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\TableController as AdminTableController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Staff\DashboardController as StaffDashboardController;
use App\Http\Controllers\Staff\ReservationController as StaffReservationController;
use App\Http\Controllers\Staff\TableController as StaffTableController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::middleware(['auth', 'role:staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::redirect('/', '/staff/dashboard');
    Route::get('/dashboard', StaffDashboardController::class)->name('dashboard');
    Route::get('/tables', StaffTableController::class)->name('tables');

    Route::get('/reservations', [StaffReservationController::class, 'index'])->name('reservations');
    Route::get('/reservations/create', [StaffReservationController::class, 'create'])->name('reservations.create');
    Route::post('/reservations', [StaffReservationController::class, 'store'])->name('reservations.store');
    Route::get('/reservations/{reservation}/edit', [StaffReservationController::class, 'edit'])->name('reservations.edit');
    Route::match(['put', 'patch'], '/reservations/{reservation}', [StaffReservationController::class, 'update'])->name('reservations.update');
    Route::delete('/reservations/{reservation}', [StaffReservationController::class, 'destroy'])->name('reservations.destroy');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::redirect('/', '/admin/dashboard');
    Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
    Route::resource('tables', AdminTableController::class)->except(['show']);
});

Route::get('/reserve', function (Request $request) {
    $date = $request->query('date');
    $partySize = $request->integer('party_size') ?: null;
    $startsAt = $request->query('starts_at');
    $tableId = $request->integer('table_id') ?: null;
    $step = $request->integer('step', 1);

    // If step 2 is requested without required selections, fall back to step 1
    if ($step === 2 && (! $date || ! $partySize || ! $startsAt || ! $tableId)) {
        $step = 1;
        $tableId = null;
    }

    // Halden standard dining tables:
    // Table 1-2 capacity 2, Table 3-4 capacity 4, Table 5 capacity 6
    $allTables = [
        ['id' => 1, 'name' => 'Table 1', 'capacity' => 2],
        ['id' => 2, 'name' => 'Table 2', 'capacity' => 2],
        ['id' => 3, 'name' => 'Table 3', 'capacity' => 4],
        ['id' => 4, 'name' => 'Table 4', 'capacity' => 4],
        ['id' => 5, 'name' => 'Table 5', 'capacity' => 6],
    ];

    $tables = [];
    if ($date && $partySize && $startsAt) {
        $tables = array_values(array_filter($allTables, function ($table) use ($partySize) {
            return $table['capacity'] >= $partySize;
        }));
    }

    return Inertia::render('book', [
        'filters' => [
            'date' => $date,
            'party_size' => $partySize,
            'starts_at' => $startsAt,
            'table_id' => $tableId,
            'step' => $step,
        ],
        'tables' => $tables,
    ]);
})->name('reserve');

Route::post('/reservations', function (Request $request) {
    return redirect()->back()->with('success', 'Table reserved successfully.');
})->name('reservations.store');
