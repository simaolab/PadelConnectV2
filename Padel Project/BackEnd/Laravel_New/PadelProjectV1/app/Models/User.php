<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Passport\HasApiTokens;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'username',
        'role_id',
        'password',
        'birthday',
        'nif',
        'last_login_at',
        'email_verified_at',
        'new_user',
        'user_blocked',
        'blocked_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'role_id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'new_user' => 'boolean',
        'user_blocked' => 'boolean',
        'password' => 'hashed'
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

    //Shows last login at with format d/m/Y
    //Carbon is a library that manipulates dates
    //This is an accessor which allows us to transform an attribute when accessing
    public function getLastLoginAtAttribute($value)
    {
        if (!empty($value)) {
            return Carbon::parse($value)->format('d/m/Y H:i:s');
        }
    }

    //Shows last login at with format d/m/Y
    //Carbon is a library that manipulates dates
    //This is an accessor which allows us to transform an attribute when accessing
    public function getEmailVerifiedAtAttribute($value)
    {
        if (!empty($value)) {
            return Carbon::parse($value)->format('d/m/Y H:i:s');
        }
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function client()
    {
        return $this->hasOne(Client::class);
    }
}
