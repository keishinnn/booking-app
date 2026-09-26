<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdministratorRequest;
use App\Http\Requests\UpdateAdministratorRequest;
use App\Http\Resources\AdministratorResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdministratorController extends Controller
{
    /**
     * Display a listing of admin accounts.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $admins = User::query()
            ->where('role', UserRole::Admin)
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/admins/index', [
            'admins' => AdministratorResource::collection($admins)->resolve(),
        ]);
    }

    /**
     * Show the form for creating an admin account.
     */
    public function create(): RedirectResponse
    {
        $this->authorize('create', User::class);

        return redirect()->route('admin.admins.index');
    }

    /**
     * Store a newly created admin account.
     */
    public function store(StoreAdministratorRequest $request): RedirectResponse
    {
        User::query()->create([
            ...$request->safe()->only(['name', 'email', 'password']),
            'role' => UserRole::Admin,
        ]);

        return redirect()
            ->route('admin.admins.index')
            ->with('success', 'Admin created.');
    }

    /**
     * Show the form for editing the specified admin account.
     */
    public function edit(User $admin): RedirectResponse
    {
        $this->authorize('update', $admin);

        return redirect()->route('admin.admins.index');
    }

    /**
     * Update the specified admin account.
     */
    public function update(UpdateAdministratorRequest $request, User $admin): RedirectResponse
    {
        $attributes = $request->safe()->only(['name', 'email']);

        if ($request->filled('password')) {
            $attributes['password'] = $request->string('password')->toString();
        }

        $admin->update($attributes);

        return redirect()
            ->route('admin.admins.index')
            ->with('success', 'Admin updated.');
    }

    /**
     * Remove the specified admin account.
     */
    public function destroy(Request $request, User $admin): RedirectResponse
    {
        $this->authorize('delete', $admin);

        if ($admin->isOnlyAdmin()) {
            return redirect()
                ->route('admin.admins.index')
                ->with('error', 'The last admin account cannot be deleted.');
        }

        $deletingSelf = $request->user()?->is($admin) ?? false;

        $admin->delete();

        if ($deletingSelf) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login');
        }

        return redirect()
            ->route('admin.admins.index')
            ->with('success', 'Admin deleted.');
    }
}
