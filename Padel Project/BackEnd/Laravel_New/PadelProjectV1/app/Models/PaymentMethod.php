<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethod extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentMethodFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'description',
    ];

    protected $hidden = [
        'created_at', 'updated_at', 'deleted_at'
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
