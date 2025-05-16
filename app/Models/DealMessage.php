<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DealMessage extends Model
{
    protected $fillable = [
        'deal_id',
        'user_id',
        'content',
        'read'
    ];

    protected $casts = [
        'read' => 'boolean'
    ];

    public function deal(): BelongsTo
    {
        return $this->belongsTo(SwapDeal::class, 'deal_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 