<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\SwapDeal;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('chat', function () {
    return true;
});

Broadcast::channel('deal.{dealId}', function ($user, $dealId) {
    $deal = SwapDeal::find($dealId);
    if (!$deal) return false;
    
    return $user->id === $deal->initiator_id || $user->id === $deal->acceptor_id;
}); 