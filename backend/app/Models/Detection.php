<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Detection extends Model
{
    protected $fillable = [
        'user_id',
        'image',
        'disease_name',
        'accuracy',
        'description',
        'solution',
    ];

    /**
     * Get the user that owns the detection.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
