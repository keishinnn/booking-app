<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;
use App\Services\EnsuresTableAvailability;

test('seated reservations block overlapping availability', function () {
    $table = Table::factory()->create(['capacity' => 4]);
    Reservation::factory()->seated()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    expect(app(EnsuresTableAvailability::class)->isAvailable(
        tableId: $table->id,
        reservedOn: '2026-10-01',
        startsAt: '19:00',
        partySize: 2,
    ))->toBeFalse();
});

test('completed and no_show reservations do not block availability', function () {
    $table = Table::factory()->create(['capacity' => 4]);

    Reservation::factory()->completed()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    Reservation::factory()->noShow()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-02',
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    expect(app(EnsuresTableAvailability::class)->isAvailable(
        tableId: $table->id,
        reservedOn: '2026-10-01',
        startsAt: '18:00',
        partySize: 2,
    ))->toBeTrue();

    expect(app(EnsuresTableAvailability::class)->isAvailable(
        tableId: $table->id,
        reservedOn: '2026-10-02',
        startsAt: '18:00',
        partySize: 2,
    ))->toBeTrue();
});

test('staff can seat a confirmed reservation and seating is idempotent', function () {
    $user = User::factory()->staff()->create();
    $reservation = Reservation::factory()->create(['status' => ReservationStatus::Confirmed]);

    $this->actingAs($user)
        ->post(route('staff.reservations.seat', $reservation))
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe(ReservationStatus::Seated);

    $this->actingAs($user)
        ->post(route('staff.reservations.seat', $reservation))
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe(ReservationStatus::Seated);
});

test('staff can complete a seated reservation', function () {
    $user = User::factory()->staff()->create();
    $reservation = Reservation::factory()->seated()->create();

    $this->actingAs($user)
        ->post(route('staff.reservations.complete', $reservation))
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe(ReservationStatus::Completed);
});

test('staff can mark a confirmed reservation as no-show', function () {
    $user = User::factory()->staff()->create();
    $reservation = Reservation::factory()->create();

    $this->actingAs($user)
        ->post(route('staff.reservations.no-show', $reservation))
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe(ReservationStatus::NoShow);
});

test('invalid lifecycle transitions return validation errors', function () {
    $user = User::factory()->staff()->create();
    $completed = Reservation::factory()->completed()->create();
    $seated = Reservation::factory()->seated()->create();

    $this->actingAs($user)
        ->post(route('staff.reservations.complete', $completed))
        ->assertSessionHasErrors();

    $this->actingAs($user)
        ->post(route('staff.reservations.no-show', $seated))
        ->assertSessionHasErrors();
});

test('guests cannot call lifecycle actions', function () {
    $reservation = Reservation::factory()->create();

    $this->post(route('staff.reservations.seat', $reservation))
        ->assertRedirect(route('login'));
});
