<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SwapComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'swap_id',
        'user_id',
        'content',
    ];

    public function swap(): BelongsTo
    {
        return $this->belongsTo(Swap::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 