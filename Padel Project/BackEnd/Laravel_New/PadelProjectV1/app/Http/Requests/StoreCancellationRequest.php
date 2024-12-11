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
        ];
    }

    //Define the messages for each specific error
    public function messages()
    {
        return [
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
