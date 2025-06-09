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
        'read',
        'attachment_path',
        'attachment_name',
        'mime_type',
        'is_image'
    ];

    protected $casts = [
        'read' => 'boolean',
        'is_image' => 'boolean'
    ];

    protected $appends = ['attachment_url'];

    public function getAttachmentUrlAttribute()
    {
        return $this->attachment_path ? asset('storage/' . $this->attachment_path) : null;
    }

    public function deal(): BelongsTo
    {
        return $this->belongsTo(SwapDeal::class, 'deal_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 