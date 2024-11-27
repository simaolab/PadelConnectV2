<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'contact',
        'nationality_id',
        'newsletter',
        'address',
        'user_id'
    ];

    protected $casts = [
        'newsletter' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'nationality_id',
        'user_id'
    ];

    public function nationality()
    {
        return $this->belongsTo(Nationality::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
