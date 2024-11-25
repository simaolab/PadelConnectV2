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
        'birthday',
        'gender',
        'contact',
        'nationality_id',
        'newsletter',
        'address_id',
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
        'address_id',
        'user_id'
    ];

    //Save birthday with format Y-m-d
    //Carbon is a library that manipulates dates
    //Function Carbon example setAttributeAttribute and getAttributeAttribute
    //The methods are automatically called by Laravel

    //This is a mutator which allows us to transform an attribute before saving
    public function setBirthdayAttribute($value)
    {
        //Converts the birthday received as d/m/Y to a Carbon object
        //Then converts the Carbon object into a string Y-m-d
        if (!empty($value)) {
            $this->attributes['birthday'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
        }
    }

    //Shows birthday with format d/m/Y
    //Carbon is a library that manipulates dates
    //This is an accessor which allows us to transform an attribute when accessing
    public function getBirthdayAttribute($value)
    {
        if (!empty($value)) {
            return Carbon::createFromFormat('Y-m-d', $value)->format('d/m/Y');
        }
    }

    public function nationality()
    {
        return $this->belongsTo(Nationality::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
