<?php

namespace App\Http\Controllers;

use App\Models\Swap;
use App\Models\SwapDeal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SwapDealController extends Controller
{
    public function index()
    {
        $deals = SwapDeal::where('initiator_id', auth()->id())
            ->orWhere('acceptor_id', auth()->id())
            ->with(['swap', 'initiator', 'acceptor', 'swap.tags'])
            ->latest()
            ->get();

        return Inertia::render('deals', [
            'deals' => $deals
        ]);
    }

    public function store(Request $request, Swap $swap)
    {
        $this->authorize('create', [SwapDeal::class, $swap]);

        $deal = SwapDeal::create([
            'swap_id' => $swap->id,
            'initiator_id' => auth()->id(),
            'acceptor_id' => $swap->user_id,
            'status' => 'pending'
        ]);

        return redirect()->route('deals.show', $deal->id);
    }

    public function show(SwapDeal $deal)
    {
        $this->authorize('view', $deal);

        return Inertia::render('deal', [
            'deal' => $deal->load(['swap', 'initiator', 'acceptor', 'swap.tags']),
            'isInitiator' => auth()->id() === $deal->initiator_id,
            'isAcceptor' => auth()->id() === $deal->acceptor_id,
        ]);
    }

    public function accept(SwapDeal $deal)
    {
        $this->authorize('accept', $deal);

        $deal->update(['status' => 'in_progress']);

        return redirect()->route('deals.show', $deal->id);
    }

    public function reject(SwapDeal $deal)
    {
        $this->authorize('reject', $deal);

        $deal->delete();

        return redirect()->route('deals.index');
    }

    public function complete(Request $request, SwapDeal $deal)
    {
        if ($deal->status !== 'in_progress') {
            return back()->with('error', 'This deal cannot be completed at this time.');
        }

        // Check if the authenticated user is either the initiator or the acceptor
        if ($request->user()->id === $deal->initiator_id) {
            $deal->initiator_accepted = true;
        } elseif ($request->user()->id === $deal->acceptor_id) {
            $deal->acceptor_accepted = true;
        } else {
            return back()->with('error', 'You are not authorized to complete this deal.');
        }

        // Check if both users have accepted
        if ($deal->initiator_accepted && $deal->acceptor_accepted) {
            $deal->status = 'completed';
        }

        $deal->save();

        return back()->with('success', $deal->status === 'completed' 
            ? 'Deal has been marked as completed.' 
            : 'Your completion has been recorded. Waiting for the other party to accept.');
    }

    public function report(Request $request, SwapDeal $deal)
    {
        $this->authorize('report', $deal);

        $validated = $request->validate([
            'reason' => 'required|string|max:1000'
        ]);

        $deal->update([
            'status' => 'reported',
            'report_reason' => $validated['reason']
        ]);

        return redirect()->route('deals.show', $deal->id);
    }

    public function rate(Request $request, SwapDeal $deal)
    {
        $this->authorize('rate', $deal);

        $validated = $request->validate([
            'rating' => 'required|string|max:1000',
            'score' => 'required|integer|min:1|max:5'
        ]);

        $isInitiator = auth()->id() === $deal->initiator_id;
        
        $deal->update([
            $isInitiator ? 'initiator_rating' : 'acceptor_rating' => $validated['rating'],
            $isInitiator ? 'initiator_rating_score' : 'acceptor_rating_score' => $validated['score']
        ]);

        return redirect()->route('deals.show', $deal->id);
    }
} 