<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateFieldRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to update a Field
    public function rules(): array
    {
        return [
            'company_id' => 'required|exists:companies,id',
            'name' => [
                'required',
                'string',
                'max:120',
                Rule::unique('fields')->ignore($this->route('field')),
            ],
            'price_hour' => 'required|numeric|min:1|max:99.99',
            'type_floor' => 'required|string|in:Piso Cimento,Piso Madeira,Piso Acrílico,Piso Relva Sintética|max:50',
            'illumination' => 'nullable|boolean',
            'cover' => 'nullable|boolean',
            'shower_room' => 'nullable|boolean',
            'lockers' => 'nullable|boolean',
            'rent_equipment' => 'nullable|boolean',
            'status' => 'required|string|max:50',
            'last_maintenance' => 'nullable|date|before_or_equal:today',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'company_id.required'   => 'É necessário associar uma ao campo',
            'company_id.exists'     => 'Selecione uma empresa válida',

            'name.required'         => 'O nome do campo é um campo obrigatório',
            'name.string'           => 'O nome do campo não aceita caractéres especiais.',
            'name.max'              => 'O nome do campo não pode exceder os 120 caracteres.',
            'name.unique'           => 'O nome do campo já está a ser usado',

            'price_hour.required'   => 'O preço/hora é um campo obrigatório.',
            'price_hour.numeric'    => 'O valor introduzido é inválido.',
            'price_hour.min'        => 'O preço/hora tem de ser maior que 1€.',
            'price_hour.max'        => 'O preço/hora não pode exceder os 99.99€.',

            'type_floor.required'   => 'O tipo de piso é um campo obrigatório',
            'type_floor.string'     => 'O tipo de piso não aceita caractéres especiais.',
            'type_floor.max'        => 'O tipo de piso não pode exceder os 30 caracteres.',
            'type_floor.in'         => 'O tipo de piso deve ser um dos seguintes Piso Cimento, Piso Madeira, Piso Acrílico, ou Piso Relva Sintética.',

            'illumination.boolean'  => 'O iluminação tem de ser sim ou não.',
            'cover.boolean'         => 'A cobertura tem de ser sim ou não.',
            'status.required'       => 'O estado do campo é obrigatório.',
            'status.string'         => 'O estado do campo não pode ter caractéres especiais.',
            'status.max'            => 'O estado do campo não pode exceder os 50 caracteres.',

            'last_maintenance.date' => 'A data da última manutenção está inválida.',
            'last_maintenance.before_or_equal' => 'A data da última manutenção não pode ser posterior a hoje.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao atualizar o campo!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
