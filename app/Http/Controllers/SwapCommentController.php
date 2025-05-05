<?php

namespace App\Http\Controllers;

use App\Models\Swap;
use App\Models\SwapComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SwapCommentController extends Controller
{
    public function store(Request $request, Swap $swap)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $swap->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        return back()->with('success', 'Comment added successfully');
    }

    public function destroy(SwapComment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();
        return back()->with('success', 'Comment deleted successfully');
    }
} 