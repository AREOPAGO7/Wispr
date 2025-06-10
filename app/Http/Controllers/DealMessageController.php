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
                'is_code_block' => ['nullable', function ($attribute, $value, $fail) {
                    if (!in_array($value, ['0', '1', 0, 1, true, false, 'true', 'false'], true)) {
                        $fail('The '.$attribute.' field must be true or false.');
                    }
                }],
            ]);

            // Convert various truthy/falsy values to boolean
            $isCodeBlock = filter_var($request->input('is_code_block', false), FILTER_VALIDATE_BOOLEAN);

            $messageData = [
                'deal_id' => $deal->id,
                'user_id' => auth()->id(),
                'content' => $validated['content'] ?? null,
                'is_code_block' => $isCodeBlock ?? false,
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
        
        $messages = $deal->messages()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json($messages);
    }
    
    /**
     * Delete a message
     *
     * @param  \App\Models\SwapDeal  $deal
     * @param  \App\Models\DealMessage  $message
     * @return \Illuminate\Http\Response
     */
    public function destroy(SwapDeal $deal, DealMessage $message)
    {
        $this->authorize('view', $deal);
        
        // Ensure the message belongs to the deal
        if ($message->deal_id !== $deal->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Message not found in this deal'
            ], 404);
        }
        
        // Only the message sender can delete their own message
        if ($message->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You can only delete your own messages'
            ], 403);
        }
        
        // Delete the message
        $message->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Message deleted successfully'
        ]);
    }
}