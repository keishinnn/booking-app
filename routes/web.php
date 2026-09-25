<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'home')->name('home');
Route::inertia('/menu', 'menu')->name('menu');
Route::inertia('/private', 'private')->name('private');
Route::inertia('/about', 'about')->name('about');
Route::inertia('/contact', 'contact')->name('contact');
Route::inertia('/terms', 'terms')->name('terms');
Route::inertia('/privacy', 'privacy')->name('privacy');

Route::get('/reserve', function (Request $request) {
    $date = $request->query('date');
    $partySize = $request->integer('party_size') ?: null;
    $startsAt = $request->query('starts_at');

    // Halden standard dining tables:
    // Table 1–2 capacity 2, Table 3–4 capacity 4, Table 5 capacity 6
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
        ],
        'tables' => $tables,
    ]);
})->name('reserve');

Route::post('/reservations', function (Request $request) {
    return redirect()->back()->with('success', 'Table reserved successfully.');
})->name('reservations.store');
