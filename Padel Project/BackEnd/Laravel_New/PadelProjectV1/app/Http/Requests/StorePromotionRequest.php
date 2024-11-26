<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePromotionRequest extends FormRequest
{
    //Level authorization do use this function
    //true = 0 level, all can do it
    //false = 1 level, need auth to use
    public function authorize(): bool
    {
        return true;
    }

    //Rules to create a promotion
    public function rules(): array
    {
        return [
            'description'           => 'required|string|max:255',
            'promo_code'            => 'required|string|max:20|unique:promotions,promo_code',
            'usage_limit'           => 'nullable|integer|min:1',
            'min_spend'             => 'nullable|regex:/^\d+(\.\d{1,2})?$/|min:0',
            'discount'              => 'required|regex:/^\d+(\.\d{1,2})?$/|min:1',
            'for_inactive_users'    => 'nullable|boolean',
            'for_new_users'         => 'nullable|boolean',
            'additional_info'       => 'nullable|string|max:500',
            'start_date'            => 'required|date_format:d/m/Y|after_or_equal:today|before_or_equal:end_date',
            'end_date'              => 'required|date_format:d/m/Y|after_or_equal:start_date',
            'generic'               => 'nullable|boolean',
            'active'                => 'nullable|boolean',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'description.required'          => 'A descrição é um campo obrigatório.',
            'description.string'            => 'A descrição tem de ser um texto',
            'description.max'               => 'A descrição não pode ter mais de 255 caracteres.',

            'promo_code.required'           => 'O código promocional é um campo obrigatório.',
            'promo_code.string'             => 'O código promocional deve ser um texto.',
            'promo_code.max'                => 'O código promocional não pode ter mais de 20 caracteres.',
            'promo_code.unique'             => 'O código promocional já existe.',

            'usage_limit.required'          => 'O limite de uso é um campo obrigatório.',
            'usage_limit.integer'           => 'O limite de uso deve ser um número.',
            'usage_limit.min'               => 'O limite de uso deve ser pelo menos 1.',

            'min_spend.required'            => 'O gasto mínimo é um campo obrigatório.',
            'min_spend.regex'               => 'O gasto mínimo deve ser um número.',
            'min_spend.min'                 => 'O gasto mínimo não pode ser menor que 0.',

            'discount.required'             => 'O desconto é um campo obrigatório.',
            'discount.regex'                => 'O desconto tem de ser um número com 0, 1 ou 2 casas decimais',
            'discount.min'                  => 'O desconto não pode ser menor que 1.',

            'for_inactive_users.boolean'    => 'Utilizadores inativos deve ser verdadeiro ou falso.',

            'for_new_users.boolean'         => 'Novos utilziadores deve ser verdadeiro ou falso.',

            'additional_info.string'        => 'As informações adicionais devem ser um texto.',
            'additional_info.max'           => 'As informações adicionais não podem ter mais de 500 caracteres.',

            'start_date.required'           => 'A data de início é um campo obrigatório.',
            'start_date.date_format'        => 'A data de início tem de estar no formato dd/mm/yyyy.',
            'start_date.after_or_equal'     => 'A data de início tem de ser a atual ou superior.',
            'start_date.before_or_equal'    => 'A data de início deve ser anterior ou igual à data de fim.',

            'end_date.required'             => 'A data de dim é obrigatória.',
            'end_date.date_format'          => 'A data de fim tem de estar no formato dd/mm/yyyy.',
            'end_date.after_or_equal'       => 'A data de fim deve ser posterior ou igual à data de início.',

            'generic.boolean'               => 'Promoção genérica deve ser verdadeiro ou falso.',

            'active.boolean'                => 'Anuncio ativo deve ser verdadeiro ou falso.',
        ];
    }

    //Throw an exception when the verification failed
    protected function failedValidation(Validator $validator)
    {
        //We need to use HttpResponse to break the current task execution and show the errors
        throw new HttpResponseException(response()->json([
            'message' => 'Erro ao criar a promoção!',
            'error(s)' => $validator->errors()
        ], 422));
    }
}
