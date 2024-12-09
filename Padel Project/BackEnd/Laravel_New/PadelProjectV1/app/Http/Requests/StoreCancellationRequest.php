<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


class StoreCancellationRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a cancellation
    public function rules(): array
    {
        return [
            'reason'            => 'nullable|string|max:255',
            'status'            => 'required|string|max:50',
            'cancellation_date' => 'nullable|date',
            'field_id'          => 'nullable|exists:fields,id',
        ];
    }

    //Define the messages for each specific error
    public function messages()
    {
        return [
            'status.required'   => 'O status é obrigatório.',
            'status.string'     => 'O status deve ser uma string.',
            'status.max'        => 'O status não pode exceder 50 caracteres.',

            'field_id.exists'   => 'O campo fornecido não existe.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar um cancelamento.',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
