<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'address',
        'city',
        'country',
        'postal_code'
    ];

    protected $hidden = [
        'created_at', 'updated_at', 'deleted_at'
    ];

    public function companies()
    {
        return $this->hasMany(Company::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }
}
