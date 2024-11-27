<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreClientRequest extends FormRequest
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
            'first_name'        => 'nullable|string|max:50',
            'last_name'         => 'nullable|string|max:50',
            'gender'            => 'nullable|string|in:Male,Female,Other',
            'contact'           => [
                'nullable',
                'regex:/^(91|92|93|96|94|95)[0-9]{7}$/',
                'unique:clients,contact'
            ],
            'nationality_id'    => 'nullable|exists:nationalities,id',
            'newsletter'        => 'boolean',
            'user_id'           => 'required|exists:users,id|unique:clients,user_id',
            'address'           => 'nullable|string|max:100',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'first_name.max'        => 'O primeiro nome deve ter no máximo 50 caractéres.',
            'last_name.max'         => 'O último nome deve ter no máximo 50 caractéres.',
            'gender.in'             => 'O gênero tem de ser masculino, feminino ou outro',
            'contact.regex'         => 'O contacto tem de ser um contacto válido português',
            'nationality_id.exists' => 'A nacionalidade selecionada é inválida',
            'newsletter.boolean'    => 'Newsletter tem de ser sim ou não',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar o cliente:',
            'errors' => $validator->errors()
        ], 422));
    }
}
