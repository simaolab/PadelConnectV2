<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreReservationRequest extends FormRequest
{
    ///Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a reservation
    public function rules(): array
    {
        return [
            'status'                                    => 'required|string|in:pendente,confirmado,cancelado',
            'privacy_policy'                            => 'required|boolean',
            'reservations'                              => 'required|array',
            'reservations.*.start_date'                 => 'required|date_format:d/m/Y H:i',
            'reservations.*.end_date'                   => 'required|date_format:d/m/Y H:i',
            'reservations.*.total'                      => 'required|numeric',
            'reservations.*.fields'                     => 'required|array',
        ];
    }

    //Define the messages for each specific error
    public function messages()
    {
        return [
            'reservations.required'                     => 'As reservas são obrigatórias.',
            'reservations.array'                        => 'O formato das reservas está incorreto.',

            'reservations.*.status.required'            => 'O status da reserva é obrigatório.',
            'reservations.*.status.string'              => 'O status da reserva deve ser texto.',
            'reservations.*.status.in'                  => 'O status da reserva deve ser um dos seguintes valores: pendente, confirmado ou cancelado.',

            'reservations.*.start_date.required'        => 'A data de início é obrigatória.',
            'reservations.*.start_date.date'            => 'A data de início deve ser uma data válida.',
            'reservations.*.start_date.before_or_equal' => 'A data de início deve ser anterior ou igual à data de término.',

            'reservations.*.end_date.required'          => 'A data de término é obrigatória.',
            'reservations.*.end_date.date'              => 'A data de término deve ser uma data válida.',
            'reservations.*.end_date.after_or_equal'    => 'A data de término deve ser posterior ou igual à data de início.',

            'reservations.*.total.required'             => 'O valor total é obrigatório.',
            'reservations.*.total.numeric'              => 'O valor total deve ser um número válido.',
            'reservations.*.total.min'                  => 'O valor total deve ser pelo menos zero.',

            'reservations.*.privacy_policy.required'    => 'É necessário aceitar a política de privacidade.',
            'reservations.*.privacy_policy.boolean'     => 'O campo de política de privacidade deve ser verdadeiro ou falso.',

            'reservations.*.fields.required'            => 'Os campos são obrigatórios.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar a reserva',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
