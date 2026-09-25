<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use Database\Seeders\TableSeeder;

test('reserve page lists only tables that fit party and are free for the window', function () {
    $this->seed(TableSeeder::class);

    $twoSeat = Table::query()->where('capacity', 2)->firstOrFail();
    $fourSeat = Table::query()->where('capacity', 4)->orderBy('name')->firstOrFail();

    $date = now()->addDays(3)->toDateString();

    Reservation::factory()->create([
        'table_id' => $fourSeat->id,
        'reserved_on' => $date,
        'starts_at' => '18:00',
        'party_size' => 2,
        'status' => ReservationStatus::Confirmed,
    ]);

    Reservation::factory()->cancelled()->create([
        'table_id' => $twoSeat->id,
        'reserved_on' => $date,
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    $this->get(route('reserve', [
        'date' => $date,
        'party_size' => 2,
        'starts_at' => '18:00',
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('book')
            ->has('tables')
            ->where('tables', function ($tables) use ($twoSeat, $fourSeat) {
                $ids = collect($tables)->pluck('id')->all();

                return in_array($twoSeat->id, $ids, true)
                    && ! in_array($fourSeat->id, $ids, true)
                    && collect($tables)->every(fn ($table) => $table['capacity'] >= 2);
            })
        );
});

test('reserve page excludes tables that are too small for the party', function () {
    $this->seed(TableSeeder::class);

    $this->get(route('reserve', [
        'date' => now()->addDays(4)->toDateString(),
        'party_size' => 6,
        'starts_at' => '19:00',
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('book')
            ->has('tables', 1)
            ->where('tables.0.capacity', 6)
        );
});
