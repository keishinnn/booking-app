<?php

namespace App\Services;

use App\Models\Table;

class ListsAvailableTables
{
    public function __construct(private EnsuresTableAvailability $availability) {}

    /**
     * @return list<array{id: string, name: string, capacity: int, image_url: string|null}>
     */
    public function handle(string $date, int $partySize, string $startsAt): array
    {
        $startsAt = $this->availability->normalizeTime($startsAt);

        return Table::query()
            ->where('capacity', '>=', $partySize)
            ->orderBy('name')
            ->get()
            ->filter(fn (Table $table): bool => $this->availability->isAvailable(
                tableId: $table->id,
                reservedOn: $date,
                startsAt: $startsAt,
                partySize: $partySize,
            ))
            ->values()
            ->map(fn (Table $table): array => [
                'id' => $table->id,
                'name' => $table->name,
                'capacity' => $table->capacity,
                'image_url' => $table->image_url,
            ])
            ->all();
    }
}
