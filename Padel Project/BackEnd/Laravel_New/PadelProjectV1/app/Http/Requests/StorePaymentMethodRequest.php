<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePaymentMethodRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a payment method
    public function rules(): array
    {
        return [
            'description' => 'required|string|max:50|unique:payment_methods,description|regex:/^[a-zA-Z0-9\s\-]+$/',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'description.required'  => 'A descrição é um campo obrigatório.',
            'description.string'    => 'A descrição não pode ter caracteres especiais.',
            'description.max'       => 'A descrição não pode ter mais de 50 caracteres.',
            'description.unique'    => 'O método de pagamento já existe, tente outro.',
            'description.regex'     => 'A descrição não pode ter caracteres especiais.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar um método de pagamento!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
