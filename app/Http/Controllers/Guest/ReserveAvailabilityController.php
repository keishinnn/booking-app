<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\AvailableTablesRequest;
use App\Services\ListsAvailableTables;
use Illuminate\Http\JsonResponse;

class ReserveAvailabilityController extends Controller
{
    public function __invoke(
        AvailableTablesRequest $request,
        ListsAvailableTables $listsAvailableTables,
    ): JsonResponse {
        $validated = $request->validated();

        return response()->json([
            'tables' => $listsAvailableTables->handle(
                date: $validated['date'],
                partySize: (int) $validated['party_size'],
                startsAt: $validated['starts_at'],
            ),
        ]);
    }
}
