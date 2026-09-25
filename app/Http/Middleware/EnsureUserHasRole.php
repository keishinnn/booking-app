<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use ValueError;

class EnsureUserHasRole
{
    /**
     * Ensure the authenticated user has the required role.
     *
     * Admins satisfy the staff role. Only admins satisfy the admin role.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        try {
            $requiredRole = UserRole::from($role);
        } catch (ValueError) {
            abort(500, 'Invalid role middleware parameter.');
        }

        $user = $request->user();

        if ($user === null || ! $user->hasRole($requiredRole)) {
            abort(403);
        }

        return $next($request);
    }
}
