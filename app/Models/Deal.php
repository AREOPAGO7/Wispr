<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    protected $table = 'swap_deals';
    
    protected $fillable = [
        'swap_id',
        'initiator_id',
        'acceptor_id',
        'status',
        'initiator_accepted',
        'acceptor_accepted'
    ];

    protected $casts = [
        'initiator_accepted' => 'boolean',
        'acceptor_accepted' => 'boolean'
    ];
} 