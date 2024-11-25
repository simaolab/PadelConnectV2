<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePaymentRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a payment
    public function rules(): array
    {
        return [
            'amount'            => 'required|regex:/^\d+(\.\d{1,2})?$/|min:0',
            'status'            => 'required|in:pendente,pago,falha',
            'payment_date'       => ['required', 'date_format:d/m/Y', 'after_or_equal:today'],
            'payment_method_id' => 'required|exists:payment_methods,id',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'amount.required'               => 'O valor do pagamento é um campo obrigatório.',
            'amount.regex'                  => 'O valor do pagamento tem de ser um número com 2 casas decimais',
            'amount.min'                    => 'O valor do pagamento tem de ser positivo.',
            'status.required'               => 'O estado do pagamento é um campo obrigatorio.',
            'status.in'                     => 'O estado do pagamento tem de ser: pendente, pago ou falha.',
            'payment_date.required'         => 'A data de pagamento é obrigatória.',
            'payment_date.date'             => 'A data de pagamento tem de ser válida.',
            'payment_date.date_format'      => 'A data de pagamento tem de estar no formato dd/mm/yyyy.',
            'payment_date.after_or_equal'   => 'A data de pagamento não pode ser inferior a hoje.',
            'payment_method_id.required'    => 'O método pagamento é obrigatório.',
            'payment_method_id.exists'      => 'O método pagamento escolhido é inválido.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao atualizar o pagamento!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
