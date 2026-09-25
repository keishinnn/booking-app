<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Resources\TableResource;
use App\Models\Table;
use Inertia\Inertia;
use Inertia\Response;

class TableController extends Controller
{
    /**
     * Display the staff tables board with live dining table data.
     */
    public function __invoke(): Response
    {
        $this->authorize('viewAny', Table::class);

        $tables = Table::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('staff/tables', [
            'tables' => TableResource::collection($tables)->resolve(),
        ]);
    }
}
