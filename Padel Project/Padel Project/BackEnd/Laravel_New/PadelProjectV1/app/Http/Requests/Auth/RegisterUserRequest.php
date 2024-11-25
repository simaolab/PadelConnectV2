<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        //Level authorization do use this function
        //true = 0 level, all can do it
        //false = 1 level, need auth to use
        return true;
    }

    /* Rules to register an account
       *
         * required  -> field is needed,
         * string    -> need to be string
         * min       -> min characters
         * max       -> max characters
         * unique    -> needs to be unique in the database, and specify the table > column
         * confirmed -> needs confirmation, in this case password_confirmation
         * digits    -> checks the number of digits
         * boolean   -> must be true or false
         * regex     -> the way the string must be, in this case:
                        * [^@] verifies it has something before @ except @
                        * +@ verifies it has the @
                        * [^@] verifies it has something after @ except @
                        * \. verifies it has the .
                        * (?=.*[a-z]) verifies at least one char is lower case
                        * (?=.*[A-Z]) verifies at least one char is upper case
                        * (?=.*[@$!%*?&]) verifies at least one char is special
                        * (?=.*\d) verifies at least one char is number
      *
    */
    public function rules(): array
    {
        return [
            'email'            => 'required|string|email|max:255|unique:users,email|regex:/^[^@]+@[^@]+\.[^@]+$/',
            'password'         => 'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/',
            'username'         => 'required|string|min:3|max:255|unique:users,username',
            'nif'              => 'required|digits:9|unique:users,nif',
            'new_user'         => 'boolean',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'email.required'            => 'The email field is required.',
            'email.email'               => 'Please enter a valid email address.',
            'email.unique'              => 'This email address already exists.',
            'email.max'                 => 'The email may not be greater than 255 characters.',
            'email.regex'               => 'The email format is invalid. It must contain "@" and a domain',

            'password.required'         => 'The password field is required.',
            'password.min'              => 'The password must be at least 8 characters.',
            'password.confirmed'        => 'The password confirmation does not match',
            'password.regex'            => 'The password must have a character a-z, A-Z, 0-9, and a special character.',

            'username.required'         => 'The username field is required.',
            'username.min'              => 'The username must be at least 3 characters.',
            'username.max'              => 'The username may not be greater than 255 characters.',
            'username.unique'           => 'This username already exists. Try another one.',

            'nif.required'              => 'The NIF field is required.',
            'nif.integer'               => 'The NIF must be an integer.',
            'nif.digits'                => 'The NIF must be at least 9 characters.',
            'nif.unique'                => 'The NIF already exists. Try another one.',

            'new_user.boolean'          => 'The new user field must be true or false.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Error registering a new user:',
            'errors'  => $validator->errors()
        ], 422));
    }
}
