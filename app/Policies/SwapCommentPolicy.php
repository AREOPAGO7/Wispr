<?php

namespace App\Policies;

use App\Models\SwapComment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SwapCommentPolicy
{
    use HandlesAuthorization;

    public function delete(User $user, SwapComment $comment): bool
    {
        return $user->id === $comment->user_id;
    }
} 