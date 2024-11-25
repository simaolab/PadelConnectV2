<?php

namespace App\Http\Requests;

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
            'address_id' => 'required|exists:addresses,id',
            'name' => [
                'required',
                'min:2',
                'max:30',
                //The unique validation needs to ignore the role we are editing
                //Rule is a class from FormRequest that allows to create your own rules
                //This Rule is saying that the company im editing is unique, but I want to ignore this specific company
                Rule::unique('companies')->ignore($this->route('company')),
            ],
            'nif'           => [
                'required',
                'regex:/^(5)[0-9]{8}$/',
                Rule::unique('companies')->ignore($this->route('company')),
            ],
            'contact'           => [
                'required',
                'regex:/^(91|92|93|96|94|95)[0-9]{7}$/',
                Rule::unique('companies')->ignore($this->route('company')),
            ],
            'email' => [
                'required',
                'email',
                //The unique validation needs to ignore the role we are editing
                //Rule is a class from FormRequest that allows to create your own rules
                //This Rule is saying that the company im editing is unique, but I want to ignore this specific company
                Rule::unique('companies')->ignore($this->route('company')),
            ],
            'newsletter' => 'nullable',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'address_id.required'   => 'A morada é um campo obrigatório.',
            'address_id.exists'     => 'A morada selecionada não é válida.',

            'name.min'              => 'O nome da empresa tem de ter no mínimo 2 caractéres.',
            'name.max'              => 'O nome da empresa não pode ter mais do que 30 caractéres.',
            'name.unique'           => 'O nome da empresa já existe, use outro nome',
            'name.required'         => 'O nome da empresa é um campo obrigatório',

            'nif.regex'             => 'O NIF tem de ter exatamente 9 digitos e começar por 5',
            'nif.unique'            => 'O NIF inserido já se encontra associado a outra empresa.',
            'nif.required'          => 'O NIF é um campo obrigatório',

            'contact.regex'         => 'O contacto tem de ser um contacto válido português.',
            'contact.unique'        => 'O contacto inserido já está associado a outro cliente.',
            'contact.required'      => 'O contacto é um campo obrigatório.',

            'email.email'           => 'Coloque um email válido (ex.: user@padelconnect.pt).',
            'email.unique'          => 'O email inserido já está associado a outro cliente.',
            'email.required'        => 'O email é um campo obrigatório.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao atualizar a empresa:',
            'errors' => $validator->errors()
        ], 422));
    }
}
