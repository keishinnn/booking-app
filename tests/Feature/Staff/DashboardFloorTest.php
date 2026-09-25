<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;

test('staff dashboard receives tables and todays confirmed reservations', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['name' => 'Table Floor', 'capacity' => 4]);

    Reservation::factory()->create([
        'table_id' => $table->id,
        'guest_name' => 'Today Guest',
        'reserved_on' => now()->toDateString(),
        'starts_at' => '18:00',
        'status' => ReservationStatus::Confirmed,
    ]);

    Reservation::factory()->cancelled()->create([
        'table_id' => $table->id,
        'guest_name' => 'Cancelled Guest',
        'reserved_on' => now()->toDateString(),
        'starts_at' => '12:00',
    ]);

    Reservation::factory()->create([
        'table_id' => $table->id,
        'guest_name' => 'Tomorrow Guest',
        'reserved_on' => now()->addDay()->toDateString(),
        'starts_at' => '19:00',
        'status' => ReservationStatus::Confirmed,
    ]);

    $this->actingAs($user)
        ->get(route('staff.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('staff/dashboard')
            ->has('tables')
            ->where('today', now()->toDateString())
            ->has('reservations', 1)
            ->where('reservations.0.guest_name', 'Today Guest')
            ->where('reservations.0.service', 'Dinner')
        );
});

test('guests cannot view the staff dashboard floor', function () {
    $this->get(route('staff.dashboard'))
        ->assertRedirect(route('login'));
});
