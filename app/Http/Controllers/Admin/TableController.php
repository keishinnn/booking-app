<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Http\Resources\TableResource;
use App\Models\Table;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TableController extends Controller
{
    /**
     * Display a listing of dining tables.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Table::class);

        $tables = Table::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/tables/index', [
            'tables' => TableResource::collection($tables)->resolve(),
            'imageOptions' => $this->imageOptions(),
        ]);
    }

    /**
     * Show the form for creating a new dining table.
     */
    public function create(): RedirectResponse
    {
        $this->authorize('create', Table::class);

        return redirect()->route('admin.tables.index');
    }

    /**
     * Store a newly created dining table.
     */
    public function store(StoreTableRequest $request): RedirectResponse
    {
        Table::query()->create($request->validated());

        return redirect()
            ->route('admin.tables.index')
            ->with('success', 'Table created.');
    }

    /**
     * Show the form for editing the specified dining table.
     */
    public function edit(Table $table): RedirectResponse
    {
        $this->authorize('update', $table);

        return redirect()->route('admin.tables.index');
    }

    /**
     * Update the specified dining table.
     */
    public function update(UpdateTableRequest $request, Table $table): RedirectResponse
    {
        $table->update($request->validated());

        return redirect()
            ->route('admin.tables.index')
            ->with('success', 'Table updated.');
    }

    /**
     * Remove the specified dining table.
     */
    public function destroy(Request $request, Table $table): RedirectResponse
    {
        $this->authorize('delete', $table);

        if ($table->reservations()->exists()) {
            return redirect()
                ->route('admin.tables.index')
                ->with('error', 'This table has reservations and cannot be deleted.');
        }

        $table->delete();

        return redirect()
            ->route('admin.tables.index')
            ->with('success', 'Table deleted.');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function imageOptions(): array
    {
        return [
            ['value' => '/images/dining-table.png', 'label' => 'Dining table'],
            ['value' => '/images/dining-room.png', 'label' => 'Dining room'],
            ['value' => '/images/lunch.png', 'label' => 'Lunch setting'],
            ['value' => '/images/long-table.png', 'label' => 'Long table'],
        ];
    }
}
