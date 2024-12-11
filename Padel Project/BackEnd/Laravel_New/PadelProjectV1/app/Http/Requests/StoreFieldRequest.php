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

    //Rules to create a field
    public function rules()
    {
        return [
            'name'                              => 'required|string|max:120|unique:fields,name',
            'price_hour' 						=> 'required|numeric|min:1|max:100',
            'company_id' 						=> 'required|exists:companies,id',
            'type_floor' 						=> 'required|string|max:50',
            'illumination' 						=> 'nullable|boolean',
            'cover' 							=> 'nullable|boolean',
            'shower_room' 						=> 'nullable|boolean',
            'lockers' 							=> 'nullable|boolean',
            'rent_equipment' 					=> 'nullable|boolean',
            'status' 							=> 'required|string|max:50',
            'last_maintenance' 					=> 'nullable|date|before_or_equal:today',
        	'file_path' 						=> 'nullable|image|mimes:jpeg,png,jpg|max:4096',

            'schedules' 						=> 'required|array',
            'schedules.weekdays' 				=> 'required|array',
            'schedules.weekdays.opening_time' 	=> 'required|date_format:H:i',
            'schedules.weekdays.closing_time' 	=> 'required|date_format:H:i|after:schedules.weekdays.opening_time',
            'schedules.weekdays.is_closed' 		=> 'required||boolean',

            'schedules.saturday' 				=> 'nullable|array',
            'schedules.saturday.opening_time' 	=> 'nullable|date_format:H:i|required_if:schedules.saturday.is_closed,false',
            'schedules.saturday.closing_time' 	=> 'nullable|date_format:H:i|after:schedules.saturday.opening_time|required_if:schedules.saturday.is_closed,false',
            'schedules.saturday.is_closed' 		=> 'nullable|boolean',

            'schedules.sunday' 					=> 'nullable|array',
            'schedules.sunday.opening_time' 	=> 'nullable|date_format:H:i|required_if:schedules.sunday.is_closed,false',
            'schedules.sunday.closing_time' 	=> 'nullable|date_format:H:i|after:schedules.sunday.opening_time|required_if:schedules.sunday.is_closed,false',
            'schedules.sunday.is_closed' 		=> 'nullable|boolean',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'company_id.required'                   => 'É necessário associar uma empresa ao campo.',
            'company_id.exists'                     => 'Selecione uma empresa válida.',

            'name.required'                         => 'O nome do campo é um campo obrigatório.',
            'name.min'                              => 'O nome do campo tem de ter no mínimo 2 caracteres.',
            'name.string'                           => 'O nome do campo não pode conter caracteres especiais.',
            'name.max'                              => 'O nome do campo não pode exceder os 120 caracteres.',
            'name.unique'                           => 'O nome do campo já está a ser usado.',

            'price_hour.required'                   => 'O preço/hora é um campo obrigatório.',
            'price_hour.numeric'                    => 'O preço/hora introduzido é inválido.',
            'price_hour.min'                        => 'O preço/hora tem de ser maior que 0€.',
            'price_hour.max'                        => 'O preço/hora não pode exceder os 100€.',

            'type_floor.required'                   => 'O tipo de piso é um campo obrigatório.',
            'type_floor.string'                     => 'O tipo de piso não pode conter caracteres especiais.',
            'type_floor.max'                        => 'O tipo de piso não pode exceder os 30 caracteres.',

          	'illumination.boolean'                  => 'A iluminação deve ser "sim" ou "não".',
            'cover.boolean'                         => 'A cobertura deve ser "sim" ou "não".',
            'shower_room.boolean'                   => 'O balneário deve ser "sim" ou "não".',
            'lockers.boolean'                       => 'Os cacifos devem ser "sim" ou "não".',
            'rent_equipment.boolean'                => 'O aluguer de equipamento deve ser "sim" ou "não".',
            'status.in'                             => 'O estado do campo deve ser um dos seguintes: Disponível, Indisponível ou Inativo.',
            'status.required'                       => 'O estado do campo é obrigatório.',
            'status.string'                         => 'O estado do campo não pode conter caracteres especiais.',

            'last_maintenance.date'                 => 'A data da última manutenção deve ter um formato válido.',
            'last_maintenance.before_or_equal'      => 'A data da última manutenção não pode ser posterior a hoje.',

          	'schedules.*.closing_time'              => 'Fecho obrigatório',
          	'schedules.*.closing_time.after'        => 'Fecho tem de ser depois da abertura',
          	'schedules.*.opening_time'              => 'Abertura obrigatória',

            'schedules.array'                       => 'Os horários devem ser fornecidos em formato de array.',

            'schedules.*.opening_time.date_format'  => 'O horário de abertura deve ser no formato HH:mm (exemplo: 09:00).',
            'schedules.*.closing_time.date_format'  => 'O horário de fechamento deve ser no formato HH:mm (exemplo: 18:00).',

            'schedules.*.is_closed.boolean'         => 'O campo "Fechado" deve ser "sim" ou "não".',
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
