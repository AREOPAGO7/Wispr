<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Swap;
use App\Models\SwapDeal;
use App\Models\SwapComment;
use App\Models\DealMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    // Users Management
    public function getUsers(Request $request)
    {
        $query = User::query();
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }
        
        return $query->latest()->paginate($request->per_page ?? 15);
    }

    public function getUser(User $user)
    {
        $user->loadCount(['swaps', 'initiatedDeals', 'receivedDeals']);
        return $user;
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'is_admin' => 'sometimes|boolean',
            'is_banned' => 'sometimes|boolean',
            'password' => 'sometimes|min:8|confirmed',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        return $user;
    }

    public function deleteUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account'], 403);
        }
        
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // Swaps Management
    public function getSwaps(Request $request)
    {
        $query = Swap::with(['user', 'tags', 'interactions']);
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        return $query->latest()->paginate($request->per_page ?? 15);
    }

    public function getSwap(Swap $swap)
    {
        $swap->load(['user', 'tags', 'comments.user', 'interactions.user']);
        return $swap;
    }

    public function updateSwap(Request $request, Swap $swap)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'offering' => 'required|string|max:255',
            'seeking' => 'required|string|max:255',
            'status' => 'required|in:active,inactive,completed,pending',
        ]);

        $swap->update($validated);
        return response()->json(['message' => 'Swap updated successfully', 'swap' => $swap]);
    }

    public function deleteSwap(Swap $swap)
    {
        $swap->delete();
        return response()->json(['message' => 'Swap deleted successfully']);
    }

    // Deals Management
    public function getDeals(Request $request)
    {
        $query = SwapDeal::with(['initiator', 'acceptor', 'swap']);
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('user_id')) {
            $query->where(function($q) use ($request) {
                $q->where('initiator_id', $request->user_id)
                  ->orWhere('acceptor_id', $request->user_id);
            });
        }
        
        if ($request->has('swap_id')) {
            $query->where('swap_id', $request->swap_id);
        }
        
        return $query->latest()->paginate($request->per_page ?? 15);
    }

    public function getDeal(SwapDeal $deal)
    {
        $deal->load(['initiator', 'acceptor', 'swap']);
        return $deal;
    }

    public function updateDeal(Request $request, SwapDeal $deal)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,accepted,rejected,completed,cancelled',
            'initiator_accepted' => 'sometimes|boolean',
            'acceptor_accepted' => 'sometimes|boolean',
        ]);

        $deal->update($validated);
        return $deal;
    }

    // Comments Management
    public function getComments(Request $request)
    {
        $query = SwapComment::with(['user', 'swap']);
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->has('swap_id')) {
            $query->where('swap_id', $request->swap_id);
        }
        
        return $query->latest()->paginate($request->per_page ?? 15);
    }

    public function deleteComment(SwapComment $comment)
    {
        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }

    // Messages Management
    public function getMessages(Request $request)
    {
        $query = DealMessage::with(['user', 'deal']);
        
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->has('deal_id')) {
            $query->where('deal_id', $request->deal_id);
        }
        
        return $query->latest()->paginate($request->per_page ?? 15);
    }

    public function deleteMessage(DealMessage $message)
    {
        $message->delete();
        return response()->json(['message' => 'Message deleted successfully']);
    }
}
