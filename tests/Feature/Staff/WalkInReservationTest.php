<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;
use App\Services\EnsuresTableAvailability;
use Illuminate\Support\Carbon;

test('staff can create a walk-in as seated for the current hour', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 18:20:00'));
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);

    $this->actingAs($user)
        ->post(route('staff.reservations.walk-in'), [
            'table_id' => $table->id,
            'guest_name' => 'Walk In Guest',
            'email' => 'walkin@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 2,
            'notes' => null,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $reservation = Reservation::query()->where('guest_name', 'Walk In Guest')->first();
    expect($reservation)->not->toBeNull()
        ->and($reservation->status)->toBe(ReservationStatus::Seated)
        ->and($reservation->table_id)->toBe($table->id)
        ->and($reservation->reserved_on->format('Y-m-d'))->toBe('2026-10-01')
        ->and(app(EnsuresTableAvailability::class)->normalizeTime((string) $reservation->starts_at))->toBe('18:00');
});

test('walk-in outside service hours is rejected', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 09:15:00'));
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);

    $this->actingAs($user)
        ->post(route('staff.reservations.walk-in'), [
            'table_id' => $table->id,
            'guest_name' => 'Too Early',
            'email' => 'early@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 2,
        ])
        ->assertSessionHasErrors('starts_at');
});

test('walk-in overlapping a seated booking is rejected', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 18:20:00'));
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);
    Reservation::factory()->seated()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    $this->actingAs($user)
        ->post(route('staff.reservations.walk-in'), [
            'table_id' => $table->id,
            'guest_name' => 'Overlap',
            'email' => 'overlap@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 2,
        ])
        ->assertSessionHasErrors();
});

test('walk-in over capacity is rejected', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 18:20:00'));
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 2]);

    $this->actingAs($user)
        ->post(route('staff.reservations.walk-in'), [
            'table_id' => $table->id,
            'guest_name' => 'Too Many',
            'email' => 'big@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 4,
        ])
        ->assertSessionHasErrors('party_size');
});
