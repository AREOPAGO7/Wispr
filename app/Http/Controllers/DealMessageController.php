<?php

namespace App\Http\Controllers;

use App\Events\NewDealMessage;
use App\Models\DealMessage;
use App\Models\SwapDeal;
use Illuminate\Http\Request;

class DealMessageController extends Controller
{
    public function store(Request $request, SwapDeal $deal)
    {
        $this->authorize('view', $deal);

        $validated = $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $message = DealMessage::create([
            'deal_id' => $deal->id,
            'user_id' => auth()->id(),
            'content' => $validated['content']
        ]);

        $message->load('user');
        broadcast(new NewDealMessage($message))->toOthers();

        return response()->json($message);
    }

    public function index(SwapDeal $deal)
    {
        $this->authorize('view', $deal);

        $messages = DealMessage::where('deal_id', $deal->id)
            ->with('user')
            ->latest()
            ->get();

        return response()->json($messages);
    }
} 