<?php

namespace App\Policies;

use App\Models\Swap;
use App\Models\SwapDeal;
use App\Models\User;

class SwapDealPolicy
{
    public function create(User $user, Swap $swap): bool
    {
        return $user->id !== $swap->user_id;
    }

    public function view(User $user, SwapDeal $deal): bool
    {
        return $user->id === $deal->initiator_id || $user->id === $deal->acceptor_id;
    }

    public function accept(User $user, SwapDeal $deal): bool
    {
        return $user->id === $deal->acceptor_id && $deal->status === 'pending';
    }

    public function reject(User $user, SwapDeal $deal): bool
    {
        return $user->id === $deal->acceptor_id && $deal->status === 'pending';
    }

    public function complete(User $user, SwapDeal $deal): bool
    {
        return ($user->id === $deal->initiator_id || $user->id === $deal->acceptor_id) 
            && $deal->status === 'in_progress';
    }

    public function report(User $user, SwapDeal $deal): bool
    {
        return ($user->id === $deal->initiator_id || $user->id === $deal->acceptor_id) 
            && in_array($deal->status, ['in_progress', 'completed']);
    }

    public function rate(User $user, SwapDeal $deal): bool
    {
        return ($user->id === $deal->initiator_id || $user->id === $deal->acceptor_id) 
            && $deal->status === 'completed';
    }
} 