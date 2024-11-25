<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreRoleRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a role
    public function rules(): array
    {
        return [
            'name' => 'required|unique:roles|min:2|max:20',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'name.required' => 'Insira o nome da role.',
            'name.unique'   => 'Esta role já se encontra criada.',
            'name.min'      => 'A role tem de ter no mínimo 2 caractéres',
            'name.max'      => 'A role não pode ter mais do que 20 caractéres',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar a role:',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
