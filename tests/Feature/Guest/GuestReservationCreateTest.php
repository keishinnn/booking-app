<?php

use App\Enums\ReservationStatus;
use App\Mail\ReservationConfirmed;
use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Support\Facades\Mail;

test('guest can create a reservation and is redirected to confirmation with mail sent', function () {
    Mail::fake();

    $table = Table::factory()->create(['capacity' => 4]);
    $date = now()->addDays(5)->toDateString();

    $response = $this->post(route('reservations.store'), [
        'table_id' => $table->id,
        'guest_name' => 'Astrid Lind',
        'email' => 'astrid@example.com',
        'phone' => '+46 70 111 2233',
        'party_size' => 2,
        'reserved_on' => $date,
        'starts_at' => '19:00',
        'notes' => 'Window please',
    ]);

    $reservation = Reservation::query()->where('email', 'astrid@example.com')->firstOrFail();

    $response->assertRedirect(route('reservations.confirmation', $reservation));

    $this->assertDatabaseHas('reservations', [
        'id' => $reservation->id,
        'guest_name' => 'Astrid Lind',
        'status' => ReservationStatus::Confirmed->value,
        'table_id' => $table->id,
    ]);

    Mail::assertSent(ReservationConfirmed::class, function (ReservationConfirmed $mail) use ($reservation) {
        return $mail->reservation->is($reservation)
            && $mail->hasTo('astrid@example.com');
    });

    $this->get(route('reservations.confirmation', $reservation))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('confirmation')
            ->where('reservation.guest_name', 'Astrid Lind')
            ->where('reservation.table.name', $table->name)
            ->where('reservation.starts_at', '19:00')
        );
});

test('guest cannot book an overlapping confirmed window', function () {
    Mail::fake();

    $table = Table::factory()->create(['capacity' => 4]);
    $date = now()->addDays(6)->toDateString();

    Reservation::factory()->create([
        'table_id' => $table->id,
        'reserved_on' => $date,
        'starts_at' => '18:00',
        'party_size' => 2,
        'status' => ReservationStatus::Confirmed,
    ]);

    $this->from(route('reserve'))
        ->post(route('reservations.store'), [
            'table_id' => $table->id,
            'guest_name' => 'Jonas Dahl',
            'email' => 'jonas@example.com',
            'phone' => '+46 70 222 3344',
            'party_size' => 2,
            'reserved_on' => $date,
            'starts_at' => '19:00',
            'notes' => null,
        ])
        ->assertRedirect(route('reserve'))
        ->assertSessionHasErrors('starts_at');

    Mail::assertNothingSent();
});

test('guest cannot book a table below party capacity', function () {
    Mail::fake();

    $table = Table::factory()->create(['capacity' => 2]);

    $this->from(route('reserve'))
        ->post(route('reservations.store'), [
            'table_id' => $table->id,
            'guest_name' => 'Elena Rost',
            'email' => 'elena@example.com',
            'phone' => '+46 70 333 4455',
            'party_size' => 4,
            'reserved_on' => now()->addDays(7)->toDateString(),
            'starts_at' => '12:00',
        ])
        ->assertRedirect(route('reserve'))
        ->assertSessionHasErrors('party_size');

    Mail::assertNothingSent();
});

test('cancelled reservation does not block guest booking for the same window', function () {
    Mail::fake();

    $table = Table::factory()->create(['capacity' => 4]);
    $date = now()->addDays(8)->toDateString();

    Reservation::factory()->cancelled()->create([
        'table_id' => $table->id,
        'reserved_on' => $date,
        'starts_at' => '13:00',
        'party_size' => 2,
    ]);

    $this->post(route('reservations.store'), [
        'table_id' => $table->id,
        'guest_name' => 'Henrik Berg',
        'email' => 'henrik@example.com',
        'phone' => '+46 70 444 5566',
        'party_size' => 2,
        'reserved_on' => $date,
        'starts_at' => '13:00',
    ])->assertRedirect();

    $this->assertDatabaseHas('reservations', [
        'email' => 'henrik@example.com',
        'status' => ReservationStatus::Confirmed->value,
    ]);

    Mail::assertSent(ReservationConfirmed::class);
});
