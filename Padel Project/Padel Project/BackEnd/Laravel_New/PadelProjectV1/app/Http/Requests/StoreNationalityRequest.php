<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreNationalityRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a nationality
    public function rules(): array
    {
        return [
            'name' => 'required|unique:nationalities|min:2|max:25',
            'continent' => 'required|in:Africa,Asia,Europa,America Norte,America Sul,Oceania',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'name.required'         => 'O nome é um campo obrigatório.',
            'name.unique'           => 'Esta nacionalidade já está criada, tente outra.',
            'name.min'              => 'A nacionalidade tem de ter no mínimo 2 caracteres.',
            'name.max'              => 'A nacionalidade não pode ter mais do que 25 caracteres.',

            'continent.required'    => 'O continente é um campo obrigatório',
            'continent.in'          => 'O continente inserido é inválido, escolha um continente válido.'
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar a nacionalidade!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
