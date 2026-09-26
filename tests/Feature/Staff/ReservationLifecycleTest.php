<?php

use App\Models\Reservation;
use App\Models\Table;
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
