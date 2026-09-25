<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;

test('guests cannot access the reservations api', function () {
    $this->getJson('/api/reservations')->assertUnauthorized();
});

test('staff can list and show reservations via the api', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['name' => 'Table API R1', 'capacity' => 4]);
    $reservation = Reservation::factory()->create([
        'table_id' => $table->id,
        'guest_name' => 'Sara Lindqvist',
        'reserved_on' => now()->addDay()->toDateString(),
        'starts_at' => '19:00',
    ]);

    $this->actingAs($user)
        ->getJson('/api/reservations')
        ->assertOk()
        ->assertJsonFragment(['guest_name' => 'Sara Lindqvist']);

    $this->actingAs($user)
        ->getJson("/api/reservations/{$reservation->id}")
        ->assertOk()
        ->assertJsonPath('data.guest_name', 'Sara Lindqvist')
        ->assertJsonPath('data.table.name', 'Table API R1');
});

test('staff can create update and cancel reservations via the api', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);

    $create = $this->actingAs($user)
        ->postJson('/api/reservations', [
            'table_id' => $table->id,
            'guest_name' => 'Henrik Berg',
            'email' => 'henrik@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 2,
            'reserved_on' => now()->addDays(2)->toDateString(),
            'starts_at' => '18:00',
            'notes' => 'Window',
        ])
        ->assertCreated()
        ->assertJsonPath('data.guest_name', 'Henrik Berg')
        ->assertJsonPath('data.status', 'confirmed');

    $id = $create->json('data.id');

    $this->actingAs($user)
        ->putJson("/api/reservations/{$id}", [
            'table_id' => $table->id,
            'guest_name' => 'Henrik Bergsson',
            'email' => 'henrik@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 3,
            'reserved_on' => now()->addDays(2)->toDateString(),
            'starts_at' => '19:00',
            'notes' => null,
            'status' => 'confirmed',
        ])
        ->assertOk()
        ->assertJsonPath('data.guest_name', 'Henrik Bergsson')
        ->assertJsonPath('data.starts_at', '19:00');

    $this->actingAs($user)
        ->deleteJson("/api/reservations/{$id}")
        ->assertNoContent();

    $this->assertDatabaseHas('reservations', [
        'id' => $id,
        'status' => ReservationStatus::Cancelled->value,
    ]);
});

test('creating an overlapping confirmed reservation is rejected', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);
    $date = now()->addDays(3)->toDateString();

    Reservation::factory()->create([
        'table_id' => $table->id,
        'reserved_on' => $date,
        'starts_at' => '18:00',
        'party_size' => 2,
        'status' => ReservationStatus::Confirmed,
    ]);

    $this->actingAs($user)
        ->postJson('/api/reservations', [
            'table_id' => $table->id,
            'guest_name' => 'Overlap Guest',
            'email' => 'overlap@example.com',
            'phone' => '+46 70 000 0000',
            'party_size' => 2,
            'reserved_on' => $date,
            'starts_at' => '19:00',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('starts_at');
});
