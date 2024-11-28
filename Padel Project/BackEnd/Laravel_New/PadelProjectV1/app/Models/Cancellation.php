<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Reservation;

class Cancellation extends Model
{
    /** @use HasFactory<\Database\Factories\CancellationFactory> */
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'reason',
        'total_refunded',
        'status',
        'cancellation_date'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'field_id'
    ];

    public function reservation(){
        return $this->belongsTo(Reservation::class);
    }

}
