<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Display the staff reservations board.
     */
    public function __invoke(): Response
    {
        return Inertia::render('staff/reservations');
    }
}
