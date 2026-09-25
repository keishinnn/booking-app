<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Http\Resources\TableResource;
use App\Models\Table;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class TableController extends Controller
{
    /**
     * Display a listing of dining tables.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Table::class);

        $tables = Table::query()
            ->orderBy('name')
            ->get();

        return TableResource::collection($tables);
    }

    /**
     * Store a newly created dining table.
     */
    public function store(StoreTableRequest $request): JsonResponse
    {
        $table = Table::query()->create($request->validated());

        return (new TableResource($table))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Display the specified dining table.
     */
    public function show(Table $table): TableResource
    {
        $this->authorize('view', $table);

        return new TableResource($table);
    }

    /**
     * Update the specified dining table.
     */
    public function update(UpdateTableRequest $request, Table $table): TableResource
    {
        $table->update($request->validated());

        return new TableResource($table->refresh());
    }

    /**
     * Remove the specified dining table.
     */
    public function destroy(Table $table): Response
    {
        $this->authorize('delete', $table);

        if ($table->reservations()->exists()) {
            abort(Response::HTTP_CONFLICT, 'This table has reservations and cannot be deleted.');
        }

        $table->delete();

        return response()->noContent();
    }
}
