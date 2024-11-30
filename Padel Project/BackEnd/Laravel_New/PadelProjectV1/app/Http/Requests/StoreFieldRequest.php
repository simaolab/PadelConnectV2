<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreFieldRequest extends FormRequest
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
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|min:2|max:100|unique:fields,name',
            'price_hour' => 'required|numeric|min:0',
            'type_floor' => 'required|string|in:Piso Cimento,Piso Madeira,Piso Acrílico,Piso Relva Sintética|max:30',
            'illumination' => 'nullable|boolean',
            'cover' => 'nullable|boolean',
            'shower_room' => 'nullable|boolean',
            'lockers' => 'nullable|boolean',
            'rent_equipment' => 'nullable|boolean',
            'status' => 'required|string|in:Disponivel,Indisponivel,Inativo|max:50',
            'last_maintenance' => 'nullable|date',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'company_id.required'    => 'É necessário associar uma ao campo',
            'company_id.exists'      => 'Selecione uma empresa válida',

            'name.required'          => 'O nome do campo é um campo obrigatório',
            'name.min'               => 'O nome do campo tem de ter no mínimo 2 caracteres.',
            'name.string'            => 'O nome do campo não aceita caractéres especiais.',
            'name.max'               => 'O nome do campo não pode exceder os 120 caracteres.',
            'name.unique'            => 'O nome do campo já está a ser usado',
 
            'price_hour.required'    => 'O preço/hora é um campo obrigatório.',
            'price_hour.numeric'     => 'O preço/hora introduzido é inválido.',
            'price_hour.min'         => 'O preço/hora tem de ser maior que 0€.',

            'type_floor.required'    => 'O tipo de piso é um campo obrigatório',
            'type_floor.string'      => 'O tipo de piso não aceita caractéres especiais.',
            'type_floor.max'         => 'O tipo de piso não pode exceder os 30 caracteres.',
            'type_floor.in'          => 'O tipo de piso deve ser um dos seguintes Piso Cimento, Piso Madeira, Piso Acrílico, ou Piso Relva Sintética.',

            'illumination.boolean'   => 'O iluminação tem de ser sim ou não.',
            'cover.boolean'          => 'A cobertura tem de ser sim ou não.',
            'shower_room.boolean'    => 'O balneário tem de ser sim ou não.',
            'lockers.boolean'        => 'Os cacifos tem de ser sim ou não.',
            'rent_equipment.boolean' => 'O aluguer de equipamento tem de ser sim ou não.',
            'status.in'              => 'O estado do campo deve ser um dos seguintes Disponivel, Indisponivel, ou Inativo.',
            'status.required'        => 'O estado do campo é obrigatório.',
            'status.string'          => 'O estado do campo não pode ter caractéres especiais.',
            'status.max'             => 'O estado do campo não pode exceder os 50 caracteres.',

            'last_maintenance.date'  => 'A data da última manutenção tem de ter um formato válido.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar um campo!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
