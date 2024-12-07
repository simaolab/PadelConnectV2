<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePasswordRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to update a Password
    public function rules(): array
    {
        return [
            'current_password'              => ['required', 'string'],
            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/',
                'different:current_password',
            ],
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'current_password.required'     => 'A password atual é obrigatória.',
            'new_password.required'         => 'A nova password é obrigatória.',
            'new_password.min'              => 'A nova password não é segura.',
            'new_password.confirmed'        => 'A confirmação de password não corresponde.',
            'new_password.regex'            => 'Tenha em atenção as verificações acima.',
            'new_password.different'        => 'A nova password não pode ser igual à atual.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao atualizar a password!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
