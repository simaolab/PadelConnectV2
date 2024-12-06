<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Promotion extends Model
{
    /** @use HasFactory<\Database\Factories\PromotionFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'description',
        'promo_code',
        'usage_limit',
        'min_spend',
        'discount',
        'for_inactive_users',
        'for_new_users',
        'additional_info',
        'start_date',
        'end_date',
        'generic',
        'active'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    //Save dates with format Y-m-d
    //Carbon is a library that manipulates dates
    //Function Carbon example setAttributeAttribute and getAttributeAttribute
    //The methods are automatically called by Laravel

    //This is a mutator which allows us to transform an attribute before saving
    // public function setStartDateAttribute($value)
    // {
    //     //Converts the start_date received as d/m/Y to a Carbon object
    //     //Then converts the Carbon object into a string Y-m-d
    //     if (!empty($value)) {
    //         $this->attributes['start_date'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
    //     }
    // }

    // //This is a mutator which allows us to transform an attribute before saving
    // public function setEndDateAttribute($value)
    // {
    //     //Converts the end_date received as d/m/Y to a Carbon object
    //     //Then converts the Carbon object into a string Y-m-d
    //     if (!empty($value)) {
    //         $this->attributes['end_date'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
    //     }
    // }

    //Shows start_date with format d/m/Y
    //Carbon is a library that manipulates dates
    //This is an accessor which allows us to transform an attribute when accessing
    // public function getStartDateAttribute($value)
    // {
    //     if (!empty($value)) {
    //         return Carbon::createFromFormat('Y-m-d', $value)->format('d/m/Y');
    //     }
    // }

    //Shows end_date with format d/m/Y
    //Carbon is a library that manipulates dates
    //This is an accessor which allows us to transform an attribute when accessing
    // public function getEndDateAttribute($value)
    // {
    //     if (!empty($value)) {
    //         return Carbon::createFromFormat('Y-m-d', $value)->format('d/m/Y');
    //     }
    // }

    public function clients()
    {
        return $this->belongsToMany(Client::class);
    }
}
