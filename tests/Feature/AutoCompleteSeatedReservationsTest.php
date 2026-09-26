<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Services\AutoCompletesSeatedReservations;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;

test('auto-completes seated reservations whose two-hour window has ended', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 20:00:00'));

    $table = Table::factory()->create(['capacity' => 4]);
    $overdue = Reservation::factory()->seated()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
    ]);
    $stillInWindow = Reservation::factory()->seated()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '19:00',
    ]);
    $confirmedPast = Reservation::factory()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '17:00',
        'status' => ReservationStatus::Confirmed,
    ]);

    expect(app(AutoCompletesSeatedReservations::class)->handle())->toBe(1);

    expect($overdue->fresh()->status)->toBe(ReservationStatus::Completed);
    expect($stillInWindow->fresh()->status)->toBe(ReservationStatus::Seated);
    expect($confirmedPast->fresh()->status)->toBe(ReservationStatus::Confirmed);
});

test('artisan command auto-completes overdue seated reservations', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 20:05:00'));

    $reservation = Reservation::factory()->seated()->create([
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
    ]);

    Artisan::call('reservations:auto-complete-seated');

    expect($reservation->fresh()->status)->toBe(ReservationStatus::Completed);
});

test('seated reservation is completed at exact window end', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 20:00:00'));

    $reservation = Reservation::factory()->seated()->create([
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
    ]);

    expect(app(AutoCompletesSeatedReservations::class)->handle())->toBe(1);
    expect($reservation->fresh()->status)->toBe(ReservationStatus::Completed);
});
