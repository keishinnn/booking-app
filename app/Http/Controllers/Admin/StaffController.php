<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Http\Resources\StaffResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    /**
     * Display a listing of floor staff.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $staff = User::query()
            ->where('role', UserRole::Staff)
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/staff/index', [
            'staff' => StaffResource::collection($staff)->resolve(),
        ]);
    }

    /**
     * Show the form for creating a floor staff account.
     */
    public function create(): RedirectResponse
    {
        $this->authorize('create', User::class);

        return redirect()->route('admin.staff.index');
    }

    /**
     * Store a newly created floor staff account.
     */
    public function store(StoreStaffRequest $request): RedirectResponse
    {
        User::query()->create([
            ...$request->safe()->only(['name', 'email', 'password']),
            'role' => UserRole::Staff,
        ]);

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff created.');
    }

    /**
     * Show the form for editing the specified floor staff account.
     */
    public function edit(User $staff): RedirectResponse
    {
        $this->authorize('update', $staff);

        return redirect()->route('admin.staff.index');
    }

    /**
     * Update the specified floor staff account.
     */
    public function update(UpdateStaffRequest $request, User $staff): RedirectResponse
    {
        $attributes = $request->safe()->only(['name', 'email']);

        if ($request->filled('password')) {
            $attributes['password'] = $request->string('password')->toString();
        }

        $staff->update($attributes);

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff updated.');
    }

    /**
     * Remove the specified floor staff account.
     */
    public function destroy(User $staff): RedirectResponse
    {
        $this->authorize('delete', $staff);

        $staff->delete();

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Staff deleted.');
    }
}
