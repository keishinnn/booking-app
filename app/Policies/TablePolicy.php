<?php

namespace App\Policies;

use App\Models\Table;
use App\Models\User;

class TablePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('staff');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Table $table): bool
    {
        return $user->hasRole('staff');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Table $table): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Table $table): bool
    {
        return $user->isAdmin();
    }
}
