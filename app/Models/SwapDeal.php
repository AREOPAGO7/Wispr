<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SwapDeal extends Model
{
    use HasFactory;

    protected $fillable = [
        'swap_id',
        'initiator_id',
        'acceptor_id',
        'status',
        'initiator_rating',
        'acceptor_rating',
        'initiator_rating_score',
        'acceptor_rating_score',
        'report_reason',
    ];

    public function swap(): BelongsTo
    {
        return $this->belongsTo(Swap::class);
    }

    public function initiator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiator_id');
    }

    public function acceptor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acceptor_id');
    }
} 