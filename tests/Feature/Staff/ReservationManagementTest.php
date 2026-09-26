<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;

test('staff reservations page receives live reservation props', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['name' => 'Table Ledger', 'capacity' => 4]);
    Reservation::factory()->create([
        'table_id' => $table->id,
        'guest_name' => 'Elena Rost',
        'reserved_on' => now()->addDay()->toDateString(),
        'starts_at' => '19:00',
    ]);

    $this->actingAs($user)
        ->get(route('staff.reservations'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('staff/reservations')
            ->has('reservations', 1)
            ->where('reservations.0.guest_name', 'Elena Rost')
            ->has('tables')
            ->has('startTimes')
        );
});

test('staff can create a reservation from the ledger', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);

    $this->actingAs($user)
        ->post(route('staff.reservations.store'), [
            'table_id' => $table->id,
            'guest_name' => 'Jonas Dahl',
            'email' => 'jonas@example.com',
            'phone' => '+46 70 555 1234',
            'party_size' => 2,
            'reserved_on' => now()->addDays(4)->toDateString(),
            'starts_at' => '12:00',
            'notes' => 'Lunch',
        ])
        ->assertRedirect(route('staff.reservations'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('reservations', [
        'guest_name' => 'Jonas Dahl',
        'status' => ReservationStatus::Confirmed->value,
    ]);
});

test('staff can update and cancel a reservation from the ledger', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 6]);
    $reservation = Reservation::factory()->create([
        'table_id' => $table->id,
        'guest_name' => 'Astrid Lind',
        'party_size' => 2,
        'reserved_on' => now()->addDays(5)->toDateString(),
        'starts_at' => '13:00',
    ]);

    $this->actingAs($user)
        ->put(route('staff.reservations.update', $reservation), [
            'table_id' => $table->id,
            'guest_name' => 'Astrid Lindqvist',
            'email' => $reservation->email,
            'phone' => $reservation->phone,
            'party_size' => 4,
            'reserved_on' => $reservation->reserved_on->format('Y-m-d'),
            'starts_at' => '14:00',
            'notes' => null,
            'status' => 'confirmed',
        ])
        ->assertRedirect(route('staff.reservations'));

    $this->assertDatabaseHas('reservations', [
        'id' => $reservation->id,
        'guest_name' => 'Astrid Lindqvist',
        'party_size' => 4,
    ]);

    $this->actingAs($user)
        ->from(route('staff.reservations'))
        ->delete(route('staff.reservations.destroy', $reservation))
        ->assertRedirect(route('staff.reservations'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('reservations', [
        'id' => $reservation->id,
        'status' => ReservationStatus::Cancelled->value,
    ]);
});
