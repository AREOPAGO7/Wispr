<?php

namespace App\Events;

use App\Models\DealMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NewDealMessage implements ShouldBroadcast
{
    use SerializesModels;

    public $message;

    public function __construct(DealMessage $message)
    {
        $this->message = $message->load('user');
    }

    public function broadcastOn()
    {
        return new Channel('chat');
    }
} 