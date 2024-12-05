<?php

namespace App\Http\Requests;

use App\Rules\NIFValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreCompanyRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a company
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'unique:companies',
                'min:2',
                'max:100',
                'regex:/^[a-zA-ZÀ-ÿ0-9.,&\-\(\)\/\s]+$/'
            ],
            'contact' => [
                'required',
                'regex:/^(91|92|93|96|94|95)[0-9]{7}$/',
                'unique:companies,contact'
            ],
            'newsletter' => 'nullable',
            'address' => 'required',
            
            'user_name' => 'required|string|min:2|max:50|unique:users,username',
            'user_email' => 'required|email|unique:users,email',
            'user_password' => 'required|min:8|confirmed',
            'user_nif' => [
                'required',
                new NIFValidationRule(),
                'unique:users,nif',
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
            'name.unique'           => 'O nome da empresa já existe, use outro nome.',
            'name.required'         => 'O nome da empresa é um campo obrigatório.',

            'nif.regex'             => 'O NIF tem de ter exatamente 9 digitos e começar por 5',
            'nif.unique'            => 'O NIF inserido já se encontra associado a outra empresa.',
            'nif.required'          => 'O NIF é um campo obrigatório.',

            'contact.regex'         => 'O contacto tem de ser um contacto válido português.',
            'contact.unique'        => 'O contacto inserido já está associado a outra empresa.',
            'contact.required'      => 'O contacto é um campo obrigatório.',

            'email.email'           => 'Coloque um email válido (ex.: user@padelconnect.pt).',
            'email.unique'          => 'O email inserido já está associado a outro cliente.',
            'email.required'        => 'O email é um campo obrigatório.',

            'user_name.required' => 'O nome do usuário é obrigatório.',
            'user_name.unique' => 'O nome do usuário já está em uso.',
            'user_email.required' => 'O email do usuário é obrigatório.',
            'user_email.email' => 'Insira um email válido para o usuário.',
            'user_email.unique' => 'O email do usuário já está em uso.',
            'user_password.required' => 'A senha do usuário é obrigatória.',
            'user_password.confirmed' => 'As senhas não coincidem.',
            'user_nif.required'          => 'O NIF é um campo obrigatório.',
            'user_nif.regex'             => 'O NIF deve ser válido e ter exatamente 9 digitos.',
            'user_nif.unique'            => 'O NIF inserido já está associado a outro usuário.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar uma empresa.',
            'error(s)' => $validator->errors()
        ], 422));
    }

}
