<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FieldSchedule extends Model
{
    use HasFactory;

    // If the table has a different name to the pluralised one in the template (ex: 'field_schedules')
    protected $table = 'field_schedule';

    // If the fields in the table do not allow mass-assignment, define the fields that are allowed
    protected $fillable = [
        'field_id',
        'day_of_week',
        'opening_time',
        'closing_time',
        'is_closed'
    ];

    /**
     * Define o relacionamento com o modelo Field.
     */
    public function field()
    {
        return $this->belongsTo(Field::class);
    }
}
