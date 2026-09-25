<?php

namespace App\Http\Controllers\Guest;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGuestReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Mail\ReservationConfirmed;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function store(StoreGuestReservationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['status'] = ReservationStatus::Confirmed;

        $reservation = Reservation::query()->create($data);
        $reservation->load('table');

        Mail::to($reservation->email)->send(new ReservationConfirmed($reservation));

        return redirect()
            ->route('reservations.confirmation', $reservation);
    }

    public function confirmation(Reservation $reservation): Response
    {
        $reservation->load('table');

        return Inertia::render('confirmation', [
            'reservation' => (new ReservationResource($reservation))->resolve(),
        ]);
    }
}
