<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Nationality extends Model
{
    /** @use HasFactory<\Database\Factories\NationalityFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'continent'
    ];

    protected $hidden = [
        'created_at', 'updated_at', 'deleted_at'
    ];

    public function clients()
    {
        return $this->hasMany(Client::class);
    }
}
