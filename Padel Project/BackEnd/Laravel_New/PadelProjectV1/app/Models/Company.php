<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'address_id',
        'name',
        'email',
        'contact',
        'nif',
        'newsletter'
    ];

    protected $hidden = [
        'address_id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function fields()
    {
        return $this->hasMany(Field::class);
    }
}
