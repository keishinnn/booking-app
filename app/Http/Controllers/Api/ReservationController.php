<?php

namespace App\Http\Controllers\Api;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ReservationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Reservation::class);

        $reservations = Reservation::query()
            ->with('table')
            ->orderByDesc('reserved_on')
            ->orderBy('starts_at')
            ->get();

        return ReservationResource::collection($reservations);
    }

    public function store(StoreReservationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? ReservationStatus::Confirmed->value;

        $reservation = Reservation::query()->create($data);
        $reservation->load('table');

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Reservation $reservation): ReservationResource
    {
        $this->authorize('view', $reservation);

        $reservation->load('table');

        return new ReservationResource($reservation);
    }

    public function update(UpdateReservationRequest $request, Reservation $reservation): ReservationResource
    {
        $reservation->update($request->validated());
        $reservation->load('table');

        return new ReservationResource($reservation->refresh()->load('table'));
    }

    public function destroy(Reservation $reservation): Response
    {
        $this->authorize('delete', $reservation);

        $reservation->update([
            'status' => ReservationStatus::Cancelled,
        ]);

        return response()->noContent();
    }
}
