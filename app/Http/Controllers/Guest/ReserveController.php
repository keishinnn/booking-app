<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Services\EnsuresTableAvailability;
use App\Services\ListsAvailableTables;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReserveController extends Controller
{
    public function __invoke(
        Request $request,
        EnsuresTableAvailability $availability,
        ListsAvailableTables $listsAvailableTables,
    ): Response {
        $date = $request->query('date');
        $partySize = $request->integer('party_size') ?: null;
        $startsAt = $request->query('starts_at');
        $tableId = $request->query('table_id');
        $step = $request->integer('step', 1);

        if (is_string($startsAt) && $startsAt !== '') {
            $startsAt = $availability->normalizeTime($startsAt);
        } else {
            $startsAt = null;
        }

        if ($step === 2 && (! $date || ! $partySize || ! $startsAt || ! $tableId)) {
            $step = 1;
            $tableId = null;
        }

        $tables = [];

        if (is_string($date) && $date !== '' && $partySize && $startsAt) {
            $tables = $listsAvailableTables->handle(
                date: $date,
                partySize: $partySize,
                startsAt: $startsAt,
            );
        }

        return Inertia::render('book', [
            'filters' => [
                'date' => is_string($date) && $date !== '' ? $date : null,
                'party_size' => $partySize,
                'starts_at' => $startsAt,
                'table_id' => is_string($tableId) && $tableId !== '' ? $tableId : null,
                'step' => $step,
            ],
            'tables' => $tables,
            'startTimes' => EnsuresTableAvailability::START_TIMES,
        ]);
    }
}
