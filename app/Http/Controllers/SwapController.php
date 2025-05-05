<?php

namespace App\Http\Controllers;

use App\Models\Swap;
use App\Models\SwapTag;
use App\Models\SwapInteraction;
use App\Models\SwapDeal;
use App\Models\SwapComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SwapController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $query = Swap::with(['user', 'tags', 'comments.user'])
            ->withCount([
                'interactions as likes_count' => function ($query) {
                    $query->where('type', 'like');
                },
                'interactions as reposts_count' => function ($query) {
                    $query->where('type', 'repost');
                },
                'interactions as saves_count' => function ($query) {
                    $query->where('type', 'save');
                },
                'comments as comments_count'
            ]);

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->has('tags')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->whereIn('name', explode(',', $request->tags));
            });
        }

        $swaps = $query->latest()->paginate(10);

        // Debug logging
        \Log::info('Swaps data:', [
            'swaps' => $swaps->map(function ($swap) {
                return [
                    'id' => $swap->id,
                    'title' => $swap->title,
                    'comments_data' => $swap->getRelation('comments')->map(function ($comment) {
                        return [
                            'id' => $comment->id,
                            'content' => $comment->content,
                            'user' => $comment->user->name
                        ];
                    })->toArray()
                ];
            })->toArray()
        ]);

        if (auth()->check()) {
            $userInteractions = SwapInteraction::where('user_id', auth()->id())
                ->whereIn('swap_id', $swaps->pluck('id'))
                ->get()
                ->groupBy('swap_id');

            $swaps->getCollection()->transform(function ($swap) use ($userInteractions) {
                $interactions = $userInteractions->get($swap->id, collect());
                $swap->isLiked = $interactions->contains('type', 'like');
                $swap->isReposted = $interactions->contains('type', 'repost');
                $swap->isSaved = $interactions->contains('type', 'save');
                return $swap;
            });
        }

        return Inertia::render('home', [
            'swaps' => $swaps,
            'filters' => $request->only(['search', 'tags']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'offering' => 'required|string|max:255',
            'seeking' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'video' => 'nullable|mimes:mp4,mov,avi|max:10240',
            'tags' => 'required|array|min:1',
            'tags.*' => 'string|max:50',
        ]);

        $swap = new Swap();
        $swap->user_id = Auth::id();
        $swap->title = $request->title;
        $swap->description = $request->description;
        $swap->offering = $request->offering;
        $swap->seeking = $request->seeking;
        $swap->status = 'active';

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('swaps/images', 'public');
            $swap->image = $path;
        }

        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('swaps/videos', 'public');
            $swap->video = $path;
        }

        $swap->save();

        // Attach tags
        $tagIds = [];
        foreach ($request->tags as $tagName) {
            $tag = SwapTag::firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }
        $swap->tags()->attach($tagIds);

        return redirect()->route('home')->with('success', 'Swap created successfully!');
    }

    public function show(Swap $swap)
    {
        $swap->load(['user', 'tags', 'interactions.user'])
            ->loadCount(['likes', 'reposts', 'saves']);

        return Inertia::render('Swap/Show', [
            'swap' => $swap,
        ]);
    }

    public function update(Request $request, Swap $swap)
    {
        $this->authorize('update', $swap);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'offering' => 'required|string|max:255',
            'seeking' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'video' => 'nullable|mimes:mp4,mov,avi|max:10240',
            'tags' => 'required|array|min:1',
            'tags.*' => 'string|max:50',
        ]);

        $swap->title = $request->title;
        $swap->description = $request->description;
        $swap->offering = $request->offering;
        $swap->seeking = $request->seeking;

        if ($request->hasFile('image')) {
            if ($swap->image) {
                Storage::disk('public')->delete($swap->image);
            }
            $path = $request->file('image')->store('swaps/images', 'public');
            $swap->image = $path;
        }

        if ($request->hasFile('video')) {
            if ($swap->video) {
                Storage::disk('public')->delete($swap->video);
            }
            $path = $request->file('video')->store('swaps/videos', 'public');
            $swap->video = $path;
        }

        $swap->save();

        // Sync tags
        $tagIds = [];
        foreach ($request->tags as $tagName) {
            $tag = SwapTag::firstOrCreate(['name' => $tagName]);
            $tagIds[] = $tag->id;
        }
        $swap->tags()->sync($tagIds);

        return redirect()->route('swaps.show', $swap)->with('success', 'Swap updated successfully!');
    }

    public function destroy(Swap $swap)
    {
        $this->authorize('delete', $swap);

        if ($swap->image) {
            Storage::disk('public')->delete($swap->image);
        }
        if ($swap->video) {
            Storage::disk('public')->delete($swap->video);
        }

        $swap->delete();

        return redirect()->route('home')->with('success', 'Swap deleted successfully!');
    }

    public function like(Request $request, Swap $swap)
    {
        $interaction = SwapInteraction::firstOrNew([
            'user_id' => Auth::id(),
            'swap_id' => $swap->id,
            'type' => 'like'
        ]);

        if ($interaction->exists) {
            $interaction->delete();
            $isLiked = false;
        } else {
            $interaction->save();
            $isLiked = true;
        }

        if ($request->wantsJson()) {
            return response()->json([
                'likes_count' => $swap->likes()->count(),
                'is_liked' => $isLiked,
            ]);
        }

        return back();
    }

    public function repost(Request $request, Swap $swap)
    {
        $interaction = SwapInteraction::firstOrNew([
            'user_id' => Auth::id(),
            'swap_id' => $swap->id,
            'type' => 'repost'
        ]);

        if ($interaction->exists) {
            $interaction->delete();
            $isReposted = false;
        } else {
            $interaction->save();
            $isReposted = true;
        }

        if ($request->wantsJson()) {
            return response()->json([
                'reposts_count' => $swap->reposts()->count(),
                'is_reposted' => $isReposted,
            ]);
        }

        return back();
    }

    public function save(Swap $swap)
    {
        $interaction = SwapInteraction::firstOrNew([
            'user_id' => Auth::id(),
            'swap_id' => $swap->id,
            'type' => 'save'
        ]);

        if ($interaction->exists) {
            $interaction->delete();
            $isSaved = false;
        } else {
            $interaction->save();
            $isSaved = true;
        }

        return response()->json([
            'saves_count' => $swap->saves()->count(),
            'is_saved' => $isSaved,
        ]);
    }

    public function createDeal(Request $request, Swap $swap)
    {
        $this->authorize('createDeal', $swap);

        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $deal = new SwapDeal();
        $deal->swap_id = $swap->id;
        $deal->user_id = Auth::id();
        $deal->message = $request->message;
        $deal->status = 'pending';
        $deal->save();

        return redirect()->route('swaps.show', $swap)->with('success', 'Deal proposal sent successfully!');
    }

    public function acceptDeal(SwapDeal $deal)
    {
        $this->authorize('acceptDeal', $deal);

        $deal->status = 'accepted';
        $deal->save();

        // Mark the swap as completed
        $deal->swap->update(['status' => 'completed']);

        return redirect()->route('swaps.show', $deal->swap)->with('success', 'Deal accepted successfully!');
    }

    public function rejectDeal(SwapDeal $deal)
    {
        $this->authorize('rejectDeal', $deal);

        $deal->status = 'rejected';
        $deal->save();

        return redirect()->route('swaps.show', $deal->swap)->with('success', 'Deal rejected successfully!');
    }

    public function rateDeal(Request $request, SwapDeal $deal)
    {
        $this->authorize('rateDeal', $deal);

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $deal->rating = $request->rating;
        $deal->rating_comment = $request->comment;
        $deal->save();

        return redirect()->route('swaps.show', $deal->swap)->with('success', 'Rating submitted successfully!');
    }

    public function storeComment(Request $request, Swap $swap)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $swap->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        if ($request->wantsJson()) {
            return response()->json($comment->load('user'));
        }

        return back();
    }

    public function destroyComment(Swap $swap, SwapComment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Comment deleted']);
        }

        return back();
    }
} 