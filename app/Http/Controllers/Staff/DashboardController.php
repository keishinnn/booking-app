<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the staff floor overview.
     */
    public function __invoke(): Response
    {
        return Inertia::render('staff/dashboard');
    }
}
