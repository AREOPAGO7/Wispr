<?php

namespace App\Http\Controllers;

use App\Models\Swap;
use App\Models\SwapTag;
use Illuminate\Support\Facades\Storage;
use App\Models\SwapDeal;
use App\Models\SwapInteraction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MySwapController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $search = $request->query('search', '');
        $status = $request->query('status', '');
        
        // Base query for user's swaps
        $query = Swap::with(['tags', 'deals', 'interactions'])
            ->where('user_id', $user->id);

        // Apply search filter if search term exists
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('offering', 'like', "%{$search}%")
                  ->orWhere('seeking', 'like', "%{$search}%")
                  ->orWhereHas('tags', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply status filter if status is provided and not 'all'
        if (!empty($status) && $status !== 'all') {
            $query->where('status', $status);
        }

        // Get paginated results
        $swaps = $query->latest()->paginate(10);

        // Calculate statistics (unfiltered counts)
        $stats = [
            'total_swaps' => Swap::where('user_id', $user->id)->count(),
            'active_swaps' => Swap::where('user_id', $user->id)->where('status', 'active')->count(),
            'completed_deals' => SwapDeal::where(function($query) use ($user) {
                $query->where('initiator_id', $user->id)
                      ->orWhere('acceptor_id', $user->id);
            })->where('initiator_accepted', true)
              ->where('acceptor_accepted', true)
              ->count(),
            
            // Debug info
            'debug_deals' => SwapDeal::where(function($query) use ($user) {
                $query->whereHas('swap', function($q) use ($user) {
                    $q->where('user_id', $user->id);
                })->orWhereHas('acceptor', function($q) use ($user) {
                    $q->where('id', $user->id);
                });
            })->get(['id', 'status', 'swap_id', 'acceptor_id'])->toArray(),
            'total_likes' => SwapInteraction::whereHas('swap', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->where('type', 'like')->count(),
        ];

        return Inertia::render('MySwaps', [
            'swaps' => $swaps,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status === '' ? 'all' : $status,
            ],
        ]);
    }

    /**
     * Display the specified swap.
     */
    public function show(Swap $swap)
    {
        $this->authorize('view', $swap);
        
        $swap->load([
            'tags',
            'user',
            'comments' => function ($query) {
                $query->with('user')->latest();
            },
            'deals' => function ($query) {
                $query->with(['initiator', 'acceptor']);
            },
            'interactions' => function ($query) {
                $query->where('user_id', auth()->id());
            }
        ]);

        // Calculate engagement stats
        $engagement = [
            'total_views' => $swap->interactions()->where('type', 'view')->count(),
            'total_likes' => $swap->likes()->count(),
            'total_comments' => $swap->comments()->count(),
            'total_deals' => $swap->deals()->count(),
        ];

        return Inertia::render('Swaps/Show', [
            'swap' => $swap,
            'engagement' => $engagement,
        ]);
    }

    /**
     * Show the form for editing the specified swap.
     */
    public function edit(Swap $swap)
    {
        $this->authorize('update', $swap);

        $swap->load('tags');
        $allTags = \App\Models\SwapTag::all();

        return Inertia::render('Swaps/Manage', [
            'swap' => $swap,
            'allTags' => $allTags,
        ]);
    }

    /**
     * Update the specified swap in storage.
     */
    public function update(Request $request, Swap $swap)
    {
        $this->authorize('update', $swap);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'offering' => 'required|string|max:255',
            'seeking' => 'required|string|max:255',
            'status' => 'required|in:active,inactive,completed',
            'tags' => 'array',
            'tags.*' => 'exists:swap_tags,id',
            'image' => 'nullable|image|max:2048',
        ]);

        // Update basic fields
        $swap->title = $validated['title'];
        $swap->description = $validated['description'];
        $swap->offering = $validated['offering'];
        $swap->seeking = $validated['seeking'];
        $swap->status = $validated['status'];

        // Handle image upload if present
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($swap->image) {
                Storage::disk('public')->delete($swap->image);
            }
            // Store new image
            $path = $request->file('image')->store('swaps/images', 'public');
            $swap->image = $path;
        }

        $swap->save();

        // Handle tags
        if (isset($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagId) {
                if (is_numeric($tagId)) {
                    $tag = SwapTag::find($tagId);
                    if ($tag) {
                        $tagIds[] = $tag->id;
                    }
                }
            }
            $swap->tags()->sync($tagIds);
        } else {
            $swap->tags()->detach();
        }

        return redirect()->route('my-swaps.show', $swap)
            ->with('success', 'Swap updated successfully');
    }

    /**
     * Remove the specified swap from storage.
     */
    public function destroy(Swap $swap)
    {
        $this->authorize('delete', $swap);

        // Delete related data
        $swap->comments()->delete();
        $swap->interactions()->delete();
        
        // Handle deals (you might want to notify the other users)
        $swap->deals()->update(['status' => 'cancelled']);
        
        // Delete image if exists
        if ($swap->image) {
            Storage::delete($swap->image);
        }

        $swap->delete();

        return redirect()->route('my-swaps.index')
            ->with('success', 'Swap deleted successfully');
    }

   
}
