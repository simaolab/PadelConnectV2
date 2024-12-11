<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateReservationRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to update a reservation
    public function rules(): array
    {
        return [
            'status'                        => 'required|string|in:pendente,confirmado,cancelado',
            'additional_info'               => 'nullable|string|max:500',
            'start_date'                    => 'required|date|before_or_equal:end_date',
            'end_date'                      => 'required|date|after_or_equal:start_date',
            'total'                         => 'required|numeric|min:0',
            'privacy_policy'                => 'required|boolean',
            'fields.required'               => 'Os campos são obrigatórios.',
        ];
    }

    //Define the messages for each specific error
    public function messages()
    {
        return [

            'status.required'               => 'O status é obrigatório.',
            'status.string'                 => 'O status deve ser texto.',
            'status.in'                     => 'O status deve ser um dos seguintes valores: pendente, confirmado ou cancelado.',


            'start_date.required'           => 'A data de início é obrigatória.',
            'start_date.date'               => 'A data de início deve ser uma data válida.',
            'start_date.before_or_equal'    => 'A data de início deve ser anterior ou igual à data de término.',

            'end_date.required'             => 'A data de término é obrigatória.',
            'end_date.date'                 => 'A data de término deve ser uma data válida.',
            'end_date.after_or_equal'       => 'A data de término deve ser posterior ou igual à data de início.',

            'total.required'                => 'O valor total é obrigatório.',
            'total.numeric'                 => 'O valor total deve ser um número válido.',
            'total.min'                     => 'O valor total deve ser pelo menos zero.',

            'privacy_policy.required'       => 'É necessário aceitar a política de privacidade.',
            'privacy_policy.boolean'        => 'O campo de política de privacidade deve ser verdadeiro ou falso.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao atualizar a reserva!',
            'errors' => $validator->errors()
        ], 422));
    }
}
