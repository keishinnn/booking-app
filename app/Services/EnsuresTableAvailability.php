<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

class EnsuresTableAvailability
{
    /**
     * @var list<string>
     */
    public const START_TIMES = [
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
    ];

    /**
     * Ensure the table can host the party for the given 2-hour window.
     *
     * @throws ValidationException
     */
    public function ensure(
        string $tableId,
        string $reservedOn,
        string $startsAt,
        int $partySize,
        ?int $ignoreReservationId = null,
    ): void {
        $table = Table::query()->find($tableId);

        if ($table === null) {
            throw ValidationException::withMessages([
                'table_id' => 'The selected table is invalid.',
            ]);
        }

        if ($partySize > $table->capacity) {
            throw ValidationException::withMessages([
                'party_size' => "Party size exceeds {$table->name}'s capacity of {$table->capacity}.",
            ]);
        }

        $startsAt = $this->normalizeTime($startsAt);

        if (! in_array($startsAt, self::START_TIMES, true)) {
            throw ValidationException::withMessages([
                'starts_at' => 'Start time must be on the hour between 11:00 and 19:00.',
            ]);
        }

        $windowStart = CarbonImmutable::parse("{$reservedOn} {$startsAt}");
        $windowEnd = $windowStart->addHours(2);

        $overlapping = Reservation::query()
            ->where('table_id', $tableId)
            ->whereDate('reserved_on', $reservedOn)
            ->where('status', ReservationStatus::Confirmed)
            ->when(
                $ignoreReservationId !== null,
                fn ($query) => $query->where('id', '!=', $ignoreReservationId),
            )
            ->get()
            ->contains(function (Reservation $reservation) use ($windowStart, $windowEnd): bool {
                $otherStart = CarbonImmutable::parse(
                    $reservation->reserved_on->format('Y-m-d').' '.$this->normalizeTime((string) $reservation->starts_at),
                );
                $otherEnd = $otherStart->addHours(2);

                return $otherStart->lt($windowEnd) && $otherEnd->gt($windowStart);
            });

        if ($overlapping) {
            throw ValidationException::withMessages([
                'starts_at' => 'That table is already booked for an overlapping time.',
            ]);
        }
    }

    public function normalizeTime(string $time): string
    {
        return CarbonImmutable::parse($time)->format('H:i');
    }
}
