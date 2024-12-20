<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to update a client
    public function rules(): array
    {
        return [
            'address'               => 'nullable',
            'first_name'            => 'nullable|string|max:50',
            'last_name'             => 'nullable|string|max:50',
            'gender'                => 'nullable|string|in:Masculino,Feminino,Outro',
            'contact'               => [
                'nullable',
                'regex:/^(91|92|93|96|94|95)[0-9]{7}$/',
                Rule::unique('clients')->ignore($this->route('client')),
            ],
            'nationality_id'        => 'nullable|exists:nationalities,id',
            'newsletter'            => 'boolean',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'address_id.exists'     => 'A morada selecionada não existe.',
            'first_name.max'        => 'O primeiro nome deve ter no máximo 50 caractéres.',
            'last_name.max'         => 'O último nome deve ter no máximo 50 caractéres.',
            'birthday.date_format'  => 'A data de nascimento tem de estar no formato dd/mm/yyyy.',
            'birthday.before'       => 'Tem de ter mais de 18 anos para criar conta.',
            'birthday.after'        => 'Data de nascimento inválida.',
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
            'message' => 'Erro ao atualizar o cliente!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
