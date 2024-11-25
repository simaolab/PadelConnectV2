<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'amount',
        'status',
        'payment_date',
        'payment_method_id',
    ];

    protected $hidden = ['payment_method_id', 'updated_at', 'deleted_at'];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    //Save payment date with format Y-m-d
    //Carbon is a library that manipulates dates
    //Function Carbon example setAttributeAttribute and getAttributeAttribute
    //The methods are automatically called by Laravel

    //This is a mutator which allows us to transform an attribute before saving
    public function setPaymentDateAttribute($value)
    {
        //Converts the payment date received as d/m/Y to a Carbon object
        //Then converts the Carbon object into a string Y-m-d
        if (!empty($value)) {
            $this->attributes['payment_date'] = Carbon::createFromFormat('d/m/Y', trim($value))->format('Y-m-d');
        }
    }

    //Shows payment date with format d/m/Y
    //Carbon is a library that manipulates dates
    //This is an accessor which allows us to transform an attribute when accessing
    public function getPaymentDateAttribute($value)
    {
        if (!empty($value)) {
            return Carbon::createFromFormat('Y-m-d', $value)->format('d/m/Y');
        }
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
