<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Carbon\CarbonImmutable;
use Illuminate\Support\Carbon;

class AutoCompletesSeatedReservations
{
    public function __construct(
        private TransitionsReservationStatus $transitions,
        private EnsuresTableAvailability $availability,
    ) {}

    /**
     * Complete seated reservations whose 2-hour window has ended.
     *
     * @return int Number of reservations completed
     */
    public function handle(?Carbon $now = null): int
    {
        $now = CarbonImmutable::parse($now ?? now());
        $completed = 0;

        Reservation::query()
            ->where('status', ReservationStatus::Seated)
            ->orderBy('id')
            ->each(function (Reservation $reservation) use ($now, &$completed): void {
                $startsAt = $this->availability->normalizeTime((string) $reservation->starts_at);
                $windowEnd = CarbonImmutable::parse(
                    $reservation->reserved_on->format('Y-m-d').' '.$startsAt,
                )->addHours(2);

                if ($now->lessThan($windowEnd)) {
                    return;
                }

                $this->transitions->complete($reservation);
                $completed++;
            });

        return $completed;
    }
}
