<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Field extends Model
{
    /** @use HasFactory<\Database\Factories\FieldFactory> */
    use HasFactory, softDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'price_hour',
        'type_floor',
        'status',
        'last_maintenance',
        'illumination',
        'cover',
        'shower_room',
        'lockers',
        'rent_equipment',
      	'file_path',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'company_id',
        'pivot'
    ];

    //Save last maintenance data with format Y-m-d
    //Carbon is a library that manipulates dates
    //Function Carbon example setAttributeAttribute and getAttributeAttribute
    //The methods are automatically called by Laravel

    //This is a mutator which allows us to transform an attribute before saving

    /* public function setLastMaintenanceAttribute($value)
    {
        //Converts the last maintenance date received as d/m/Y to a Carbon object
        //Then converts the Carbon object into a string Y-m-d
        if (!empty($value)) {
            $this->attributes['last_maintenance'] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
        }
    } */

    //Shows the last maintenance date with format d/m/Y
    //Carbon is a library that manipulates dates
    //This is an accessor which allows us to transform an attribute when accessing
    public function getLastMaintenanceAttribute($value)
    {
        if (!empty($value)) {
            return Carbon::createFromFormat('Y-m-d', $value)->format('d/m/Y');
        }
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function reservations()
    {
        return $this->belongsToMany(Reservation::class, 'field_reservation')
                    ->withPivot('start_date', 'end_date')
                    ->withTimestamps();
    }
  	public function schedules() {
		return $this->hasMany(FieldSchedule::class);
    }
}
