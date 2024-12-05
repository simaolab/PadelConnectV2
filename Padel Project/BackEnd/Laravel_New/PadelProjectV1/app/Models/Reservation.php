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
      	'user_id',
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
        return $this->belongsToMany(Field::Class, 'field_reservation');
    }

  	public function cancellation()
    {
        return $this->hasOne(Cancellation::class, 'reservation_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    //Save birthday with format Y-m-d
    //Carbon is a library that manipulates dates
    //Function Carbon example setAttributeAttribute and getAttributeAttribute
    //The methods are automatically called by Laravel

    public function setStartDateAttribute($value)
    {
        // Tenta formatar a data com qualquer formato válido
        $this->attributes['start_date'] = Carbon::parse($value)->format('Y-m-d H:i:s');
    }

    public function setEndDateAttribute($value)
    {
        // Tenta formatar a data com qualquer formato válido
        $this->attributes['end_date'] = Carbon::parse($value)->format('Y-m-d H:i:s');
    }


    // Accessor para mostrar start_date com formato d/m/Y H:i
    public function getStartDateAttribute($value)
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $value)->format('d/m/Y H:i');
    }

    // Accessor para mostrar end_date com formato d/m/Y H:i
    public function getEndDateAttribute($value)
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $value)->format('d/m/Y H:i');
    }
}
