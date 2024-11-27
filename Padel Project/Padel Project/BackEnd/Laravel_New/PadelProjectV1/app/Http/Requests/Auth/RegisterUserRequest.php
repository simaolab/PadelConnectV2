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
            'email'            => 'required|string|max:100|unique:users,email|regex:/^[^@]+@[^@]+\.[^@]+$/',
            'password'         => 'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/',
            'username'         => 'required|string|min:3|max:30|unique:users,username',
            'nif'              => 'required|digits:9|unique:users,nif',
            'birthday'         => 'required|date_format:d/m/Y|before:18 years ago|after:110 years ago',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'email.required'            => 'O email é um campo obrigatório',
            'email.unique'              => 'Esse email já está em uso',
            'email.max'                 => 'O email não pode ter mais que 100 caracteres.',
            'email.regex'               => 'O email esta invalido. Tem de conter "@" e um dominio',

            'password.required'         => 'A password é um campo obrigatorio',
            'password.min'              => 'A password tem de ter no minimo 8 caracteres',
            'password.confirmed'        => 'As passwords não coincidem.',
            'password.regex'            => 'A password tem de ter no minimo 1 caracter a-z, A-Z, 0-9, e 1 caracter especial',

            'username.required'         => 'O username é um campo obrigatório.',
            'username.min'              => 'O username tem de ter no mínimo 2 catacteres.',
            'username.max'              => 'O username tem de ter no mínimo 30 catacteres.',
            'username.unique'           => 'Este username já está em uso',

            'nif.required'              => 'O NIF é um campo obrigatório.',
            'nif.integer'               => 'O NIF tem de ser um número.',
            'nif.digits'                => 'O NIF tem de ter 9 digitos no minimo.',
            'nif.unique'                => 'O NIF já se encontra associado a um utilizador.',

            'birthday.date_format'      => 'A data de nascimento tem de estar no formato dd/mm/yyyy.',
            'birthday.before'           => 'Tem de ter mais de 18 anos para criar conta.',
            'birthday.after'            => 'Data de nascimento inválida.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao registar a conta',
            'error(s)'  => $validator->errors()
        ], 422));
    }
}
