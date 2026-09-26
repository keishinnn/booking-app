<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteProfileRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the authenticated user's profile.
     */
    public function edit(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $this->authorize('view', $user);

        return Inertia::render('profile', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'is_only_admin' => $user->isOnlyAdmin(),
            ],
        ]);
    }

    /**
     * Update the authenticated user's name and email.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $request->user()->update($request->safe()->only(['name', 'email']));

        return redirect()
            ->route('profile.edit')
            ->with('success', 'Profile updated.');
    }

    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => $request->validated('password'),
        ]);

        return redirect()
            ->route('profile.edit')
            ->with('success', 'Password updated.');
    }

    /**
     * Delete the authenticated user's account.
     */
    public function destroy(DeleteProfileRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->authorize('delete', $user);

        if ($user->isOnlyAdmin()) {
            return redirect()
                ->route('profile.edit')
                ->with('error', 'The last admin account cannot be deleted.');
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
