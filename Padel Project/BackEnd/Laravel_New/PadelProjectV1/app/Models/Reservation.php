<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory, softDeletes;

    protected $fillable = [
        'type_reservation',
        'status',
        'additional_info',
        'start_date',
        'end_date',
        'total',
        'privacy_policy',
        'fields'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function fields()
    {
        return $this->belongsToMany(Field::Class);
    }


    //Save birthday with format Y-m-d
    //Carbon is a library that manipulates dates
    //Function Carbon example setAttributeAttribute and getAttributeAttribute
    //The methods are automatically called by Laravel

    //This is a mutator which allows us to transform an attribute before saving
    public function setStartDateAttribute($value)
    {
        //Converts the birthday received as d/m/Y to a Carbon object
        //Then converts the Carbon object into a string Y-m-d
        $this->attributes['start_date'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
    }
    public function setEndDateAttribute($value)
    {
        //Converts the birthday received as d/m/Y to a Carbon object
        //Then converts the Carbon object into a string Y-m-d
        $this->attributes['end_date'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
    }

    //Shows birthday with format d/m/Y
    //Carbon is a library that manipulates dates
    //This is an accessor which allows us to transform an attribute when accessing
    public function getStartDateAttribute($value)
    {
        return Carbon::createFromFormat('Y-m-d', $value)->format('d/m/Y');
    }

    public function getEndDateAttribute($value)
    {
        return Carbon::createFromFormat('Y-m-d', $value)->format('d/m/Y');
    }
}
