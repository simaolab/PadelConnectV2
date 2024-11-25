<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreAddressRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a address
    public function rules(): array{
        return [
            'address'       => 'required|string|max:255',
            'city'          => 'nullable|string|max:100',
            'country'       => 'required|string|max:75',
            'postal_code'   => 'nullable|string|max:8|min:8',
            ];
    }
    public function messages(): array{
        return [
            'address.required' => 'Insira a morada.',
            'address.string' => 'A morada não pode conter caractéres especiais.',
            'address.max' => 'A morada não pode exceder os 255 caractéres.',

            'city.string' => 'A cidade não pode conter caractéres especiais.',
            'city.max' => 'A cidade não pode exceder os 100 caractéres.',

            'country.required' => 'Insira o país.',
            'country.string' => 'O país não pode conter caractéres especiais.',
            'country.max' => 'O país não pode exceder os 75 caractéres.',

            'postal_code.string' => 'O código postal não pode conter caractéres especiais.',
            'postal_code.max' => 'O código postal tem de ter 8 catactéres.',
            'postal_code.min' => 'O código postal tem de ter 8 catactéres.'
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar a morada',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
