<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Swap extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'offering',
        'seeking',
        'image',
        'video',
        'uid',
        'status',
    ];

    protected $casts = [
        'uid' => 'string',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($swap) {
            if (empty($swap->uid)) {
                $swap->uid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(SwapTag::class, 'swap_swap_tag');
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(SwapInteraction::class);
    }

    public function comments()
    {
        return $this->hasMany(SwapComment::class);
    }

    public function deals(): HasMany
    {
        return $this->hasMany(SwapDeal::class);
    }

    public function likes()
    {
        return $this->interactions()->where('type', 'like');
    }

    public function reposts()
    {
        return $this->interactions()->where('type', 'repost');
    }

    public function saves()
    {
        return $this->interactions()->where('type', 'save');
    }

    public function getRouteKeyName()
    {
        return 'uid';
    }
} 