<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Illuminate\Validation\ValidationException;

class TransitionsReservationStatus
{
    public function seat(Reservation $reservation): void
    {
        if ($reservation->status === ReservationStatus::Seated) {
            return;
        }

        if ($reservation->status !== ReservationStatus::Confirmed) {
            throw ValidationException::withMessages([
                'status' => 'Only confirmed reservations can be seated.',
            ]);
        }

        $reservation->update(['status' => ReservationStatus::Seated]);
    }

    public function complete(Reservation $reservation): void
    {
        if ($reservation->status !== ReservationStatus::Seated) {
            throw ValidationException::withMessages([
                'status' => 'Only seated reservations can be completed.',
            ]);
        }

        $reservation->update(['status' => ReservationStatus::Completed]);
    }

    public function noShow(Reservation $reservation): void
    {
        if ($reservation->status !== ReservationStatus::Confirmed) {
            throw ValidationException::withMessages([
                'status' => 'Only confirmed reservations can be marked no-show.',
            ]);
        }

        $reservation->update(['status' => ReservationStatus::NoShow]);
    }
}
