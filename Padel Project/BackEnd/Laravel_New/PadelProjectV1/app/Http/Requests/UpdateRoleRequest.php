<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to update a role
    public function rules(): array
    {
        return [
            'name'          => [
                'required',
                'min:1',
                'max:20',
                //The unique validation needs to ignore the role we are editing
                //Rule is a class from FormRequest that allows to create your own rules
                //This Rule is saying that the role im editing is unique, but I want to ignore this specific role
                Rule::unique('roles')->ignore($this->route('role')),
            ],
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'name.required' => 'Insira o nome da role.',
            'name.unique'   => 'Esta role já se encontra criada.',
            'name.min'      => 'A role tem de ter no mínimo 2 caractéres.',
            'name.max'      => 'A role não pode ter mais do que 20 caractéres.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao atualizar a role:',
            'errors' => $validator->errors()
        ], 422));
    }
}
