<?php

namespace App\Policies;

use App\Models\Swap;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SwapPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Anyone can view swaps
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Swap $swap): bool
    {
        return true; // Anyone can view a specific swap
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Any authenticated user can create a swap
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Swap $swap): bool
    {
        return $user->id === $swap->user_id; // Only the swap creator can update it
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Swap $swap): bool
    {
        return $user->id === $swap->user_id; // Only the swap creator can delete it
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Swap $swap): bool
    {
        return $user->id === $swap->user_id; // Only the swap creator can restore it
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Swap $swap): bool
    {
        return $user->id === $swap->user_id; // Only the swap creator can permanently delete it
    }
}
