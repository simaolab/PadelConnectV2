<?php

namespace App\Http\Requests;

use App\Rules\NIFValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to update a company
    public function rules(): array
    {
        return [
            'address'               => 'required',
            'name'                  => [
                'required',
                'min:2',
                'max:30',
                //The unique validation needs to ignore the role we are editing
                //Rule is a class from FormRequest that allows to create your own rules
                //This Rule is saying that the company im editing is unique, but I want to ignore this specific company
                Rule::unique('companies', 'name')->ignore($this->route('company')),
            ],
            'contact'               => [
                'nullable',
                'regex:/^(91|92|93|96|94|95)[0-9]{7}$/',
                Rule::unique('companies', 'contact')->ignore($this->route('company'))
            ],
            'newsletter'            => 'nullable',
            'user_email'            => [
              	'required',
            ],
            'user_nif'              => [
                'required',
            ],
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'address.required'      => 'A morada é um campo obrigatório.',

            'name.min'              => 'O nome da empresa tem de ter no mínimo 2 caractéres.',
            'name.max'              => 'O nome da empresa não pode ter mais do que 30 caractéres.',
            'name.unique'           => 'O nome da empresa já existe, use outro nome',
            'name.required'         => 'O nome da empresa é um campo obrigatório',

            'contact.regex'         => 'O contacto tem de ser um contacto válido português.',
            'contact.unique'        => 'O contacto inserido já está associado a outro cliente.',

            'user_email.email'      => 'Insira um email válido para o utilizador.',

            'user_nif.required'     => 'O NIF é um campo obrigatório.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao atualizar a empresa:',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
