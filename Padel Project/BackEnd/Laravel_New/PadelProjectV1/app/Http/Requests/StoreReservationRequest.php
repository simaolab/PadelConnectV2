<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status'           => 'required|string|in:pendente,confirmado,cancelado',
            'additional_info'  => 'nullable|string|max:500',
            'start_date'       => 'required|date_format:d/m/Y H:i|before_or_equal:end_date',
            'end_date'         => 'required|date_format:d/m/Y H:i|after_or_equal:start_date',
            'total'            => 'required|numeric|min:0',
            'privacy_policy'   => 'nullable|boolean',
            'fields'           => 'required|array',
        ];
    }


    public function messages()
    {
        return [
            'type_reservation.required' => 'O tipo de reserva é obrigatório.',
            'type_reservation.string'   => 'O tipo de reserva deve ser texto.',
            'type_reservation.in'       => 'O tipo de reserva deve ser um dos seguintes valores: anual, simples ou usual.',

            'status.required'           => 'O status é obrigatório.',
            'status.string'             => 'O status deve ser texto.',
            'status.in'                 => 'O status deve ser um dos seguintes valores: pendente, confirmado ou cancelado.',

            'start_date.required'       => 'A data de início é obrigatória.',
            'start_date.date'           => 'A data de início deve ser uma data válida.',
            'start_date.before_or_equal' => 'A data de início deve ser anterior ou igual à data de término.',

            'end_date.required'         => 'A data de término é obrigatória.',
            'end_date.date'             => 'A data de término deve ser uma data válida.',
            'end_date.after_or_equal'   => 'A data de término deve ser posterior ou igual à data de início.',


            'total.required'            => 'O valor total é obrigatório.',
            'total.numeric'             => 'O valor total deve ser um número válido.',
            'total.min'                 => 'O valor total deve ser pelo menos zero.',

            'privacy_policy.required'   => 'É necessário aceitar a política de privacidade.',
            'privacy_policy.boolean'    => 'O campo de política de privacidade deve ser verdadeiro ou falso.',

            'fields.required'           => 'Os campos são obrigatórios.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar a reserva',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
