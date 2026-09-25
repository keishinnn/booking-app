<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;
use Database\Seeders\TableSeeder;

test('staff tables page receives dining tables from the database', function () {
    $this->seed(TableSeeder::class);
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get(route('staff.tables'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('staff/tables')
            ->has('tables', 5)
            ->where('tables.0.name', 'Table 1')
            ->where('tables.0.capacity', 2)
            ->where('tables.4.name', 'Table 5')
            ->where('tables.4.capacity', 6)
            ->where('today', now()->toDateString())
            ->has('reservations', 0)
        );
});

test('staff tables page includes todays confirmed reservations for the floor schedule', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['name' => 'Table Bay', 'capacity' => 4]);

    Reservation::factory()->create([
        'table_id' => $table->id,
        'guest_name' => 'Floor Guest',
        'reserved_on' => now()->toDateString(),
        'starts_at' => '13:00',
        'status' => ReservationStatus::Confirmed,
    ]);

    Reservation::factory()->cancelled()->create([
        'table_id' => $table->id,
        'guest_name' => 'Cancelled Guest',
        'reserved_on' => now()->toDateString(),
        'starts_at' => '18:00',
    ]);

    Reservation::factory()->create([
        'table_id' => $table->id,
        'guest_name' => 'Tomorrow Guest',
        'reserved_on' => now()->addDay()->toDateString(),
        'starts_at' => '19:00',
        'status' => ReservationStatus::Confirmed,
    ]);

    $this->actingAs($user)
        ->get(route('staff.tables'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('staff/tables')
            ->has('reservations', 1)
            ->where('reservations.0.guest_name', 'Floor Guest')
            ->where('reservations.0.service', 'Lunch')
            ->where('today', now()->toDateString())
        );
});
