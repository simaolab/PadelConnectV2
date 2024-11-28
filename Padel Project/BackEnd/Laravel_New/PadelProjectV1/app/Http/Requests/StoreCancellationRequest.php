<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


class StoreCancellationRequest extends FormRequest
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
            'reason' => 'nullable|string|max:255',
            'status' => 'required|string|max:50',
            'cancellation_date' => 'nullable|date',
            'field_id' => 'nullable|exists:fields,id',
        ];
    }

    public function messages()
    {
        return [
            'status.required' => 'O status é obrigatório.',
            'status.string' => 'O status deve ser uma string.',
            'status.max' => 'O status não pode exceder 50 caracteres.',
            'field_id.exists' => 'O campo fornecido não existe.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Error: The provided data contains validation errors. Please review the information and try again.',
            'errors' => $validator->errors()
        ], 422));
    }
}
