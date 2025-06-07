<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $casts = [
        'initiator_rating_score' => 'integer',
        'acceptor_rating_score' => 'integer',
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

    public function messages(): HasMany
    {
        return $this->hasMany(DealMessage::class, 'deal_id');
    }
} 