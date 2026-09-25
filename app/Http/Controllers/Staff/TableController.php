<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TableController extends Controller
{
    /**
     * Display the staff tables board.
     */
    public function __invoke(): Response
    {
        return Inertia::render('staff/tables');
    }
}
