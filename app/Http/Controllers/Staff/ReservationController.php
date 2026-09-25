<?php

namespace App\Http\Controllers\Staff;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Http\Resources\TableResource;
use App\Models\Reservation;
use App\Models\Table;
use App\Services\EnsuresTableAvailability;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Reservation::class);

        $reservations = Reservation::query()
            ->with('table')
            ->orderByDesc('reserved_on')
            ->orderBy('starts_at')
            ->get();

        $tables = Table::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('staff/reservations', [
            'reservations' => ReservationResource::collection($reservations)->resolve(),
            'tables' => TableResource::collection($tables)->resolve(),
            'startTimes' => EnsuresTableAvailability::START_TIMES,
        ]);
    }

    public function create(): RedirectResponse
    {
        $this->authorize('create', Reservation::class);

        return redirect()->route('staff.reservations');
    }

    public function store(StoreReservationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? ReservationStatus::Confirmed->value;

        Reservation::query()->create($data);

        return redirect()
            ->route('staff.reservations')
            ->with('success', 'Reservation created.');
    }

    public function edit(Reservation $reservation): RedirectResponse
    {
        $this->authorize('update', $reservation);

        return redirect()->route('staff.reservations');
    }

    public function update(UpdateReservationRequest $request, Reservation $reservation): RedirectResponse
    {
        $reservation->update($request->validated());

        return redirect()
            ->route('staff.reservations')
            ->with('success', 'Reservation updated.');
    }

    public function destroy(Reservation $reservation): RedirectResponse
    {
        $this->authorize('delete', $reservation);

        $reservation->update([
            'status' => ReservationStatus::Cancelled,
        ]);

        return redirect()
            ->route('staff.reservations')
            ->with('success', 'Reservation cancelled.');
    }
}
