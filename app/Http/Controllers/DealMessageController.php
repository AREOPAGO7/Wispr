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
        try {
            $this->authorize('view', $deal);

            $validated = $request->validate([
                'content' => 'nullable|string|max:1000',
                'attachment' => 'nullable|file|max:10240', // 10MB max
            ]);

            $messageData = [
                'deal_id' => $deal->id,
                'user_id' => auth()->id(),
                'content' => $validated['content'] ?? null,
            ];

            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $path = $file->store('deal_attachments/' . $deal->id, 'public');
                
                $messageData['attachment_path'] = $path;
                $messageData['attachment_name'] = $file->getClientOriginalName();
                $messageData['mime_type'] = $file->getMimeType();
                $messageData['is_image'] = str_starts_with($messageData['mime_type'], 'image/');
                if (isset($messageData['is_image']) && $messageData['is_image']) {
                    $messageData['size'] = $file->getSize();
                }
            }

            $message = DealMessage::create($messageData);
            $message->load('user');
            
            broadcast(new NewDealMessage($message))->toOthers();

            return response()->json([
                'status' => 'success',
                'message' => $message
            ], 200, [], JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            \Log::error('Error sending message: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send message: ' . $e->getMessage()
            ], 500, [], JSON_PRETTY_PRINT);
        }
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