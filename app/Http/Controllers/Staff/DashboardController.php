<?php

namespace App\Http\Controllers\Staff;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Http\Resources\TableResource;
use App\Models\Reservation;
use App\Models\Table;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the staff floor overview with today's live bookings.
     */
    public function __invoke(): Response
    {
        $this->authorize('viewAny', Table::class);
        $this->authorize('viewAny', Reservation::class);

        $today = now()->toDateString();

        $tables = Table::query()
            ->orderBy('name')
            ->get();

        $reservations = Reservation::query()
            ->with('table')
            ->whereDate('reserved_on', '>=', $today)
            ->whereIn('status', ReservationStatus::blocking())
            ->orderBy('reserved_on')
            ->orderBy('starts_at')
            ->get();

        return Inertia::render('staff/dashboard', [
            'tables' => TableResource::collection($tables)->resolve(),
            'reservations' => ReservationResource::collection($reservations)->resolve(),
            'today' => $today,
        ]);
    }
}
