<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateNationalityRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'min:1',
                'max:50',
                //The unique validation needs to ignore the role we are editing
                //Rule is a class from FormRequest that allows to create your own rules
                //This Rule is saying that the role im editing is unique, but I want to ignore this specific role
                Rule::unique('nationalities')->ignore($this->route('nationality')),
            ],
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
            'continent.in'          => 'A continente inserido é inválido, escolha um continente válido.'
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao atualizar a nacionaliddade!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
