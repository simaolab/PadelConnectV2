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
            'price_hour'                            => 'required|numeric|min:1|max:99.99',
            'type_floor'                            => 'required|string|in:Piso Cimento,Piso Madeira,Piso Acrílico,Piso Relva Sintética|max:50',
            'illumination'                          => 'nullable|boolean',
            'cover'                                 => 'nullable|boolean',
            'shower_room'                           => 'nullable|boolean',
            'lockers'                               => 'nullable|boolean',
            'rent_equipment'                        => 'nullable|boolean',
            'status'                                => 'required|string|max:50',
            'last_maintenance'                      => 'nullable|date|before_or_equal:today',
            'schedules'                             => 'nullable|array',
            'schedules.*.day_of_week'               => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'schedules.*.opening_time'              => 'nullable|date_format:H:i',
            'schedules.*.closing_time'              => 'nullable|date_format:H:i',
            'schedules.*.is_closed'                 => 'nullable|boolean',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'company_id.required'                   => 'É necessário associar uma empresa ao campo.',
            'company_id.exists'                     => 'Selecione uma empresa válida.',

            'name.required'                         => 'O nome do campo é um campo obrigatório.',
            'name.string'                           => 'O nome do campo não pode conter caracteres especiais.',
            'name.max'                              => 'O nome do campo não pode exceder os 120 caracteres.',
            'name.unique'                           => 'O nome do campo já está a ser usado.',

            'price_hour.required'                   => 'O preço/hora é um campo obrigatório.',
            'price_hour.numeric'                    => 'O valor introduzido para o preço/hora é inválido.',
            'price_hour.min'                        => 'O preço/hora tem de ser maior que 1€.',
            'price_hour.max'                        => 'O preço/hora não pode exceder os 99.99€.',

            'type_floor.required'                   => 'O tipo de piso é um campo obrigatório.',
            'type_floor.string'                     => 'O tipo de piso não pode conter caracteres especiais.',
            'type_floor.max'                        => 'O tipo de piso não pode exceder os 50 caracteres.',
            'type_floor.in'                         => 'O tipo de piso deve ser um dos seguintes: Piso Cimento, Piso Madeira, Piso Acrílico ou Piso Relva Sintética.',

            'illumination.boolean'                  => 'A iluminação deve ser "sim" ou "não".',
            'cover.boolean'                         => 'A cobertura deve ser "sim" ou "não".',
            'shower_room.boolean'                   => 'O balneário deve ser "sim" ou "não".',
            'lockers.boolean'                       => 'Os cacifos devem ser "sim" ou "não".',
            'rent_equipment.boolean'                => 'O aluguer de equipamento deve ser "sim" ou "não".',
            'status.required'                       => 'O estado do campo é obrigatório.',
            'status.string'                         => 'O estado do campo não pode conter caracteres especiais.',
            'status.max'                            => 'O estado do campo não pode exceder os 50 caracteres.',
            'status.in'                             => 'O estado do campo deve ser um dos seguintes: Disponível, Indisponível ou Inativo.',

            'last_maintenance.date'                 => 'A data da última manutenção deve ser uma data válida.',
            'last_maintenance.before_or_equal'      => 'A data da última manutenção não pode ser posterior a hoje.',

            'schedules.array'                       => 'Os horários devem ser fornecidos como um array.',
            'schedules.*.day_of_week.required'      => 'O dia da semana é obrigatório para cada horário.',
            'schedules.*.day_of_week.in'            => 'O dia da semana deve ser um dos seguintes: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.',

            'schedules.*.opening_time.nullable'     => 'O horário de abertura é opcional.',
            'schedules.*.opening_time.date_format'  => 'O horário de abertura deve ser no formato HH:mm (exemplo: 09:00).',
            'schedules.*.closing_time.nullable'     => 'O horário de fechamento é opcional.',
            'schedules.*.closing_time.date_format'  => 'O horário de fechamento deve ser no formato HH:mm (exemplo: 18:00).',

            'schedules.*.is_closed.boolean'         => 'O campo "Fechado" deve ser "sim" ou "não".',
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
