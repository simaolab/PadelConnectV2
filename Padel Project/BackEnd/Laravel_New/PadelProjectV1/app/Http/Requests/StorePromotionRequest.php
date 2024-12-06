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
            'description'           => 'required|string|max:100|min:5',
            'promo_code'            => 'required|string|max:20|min:2|unique:promotions,promo_code',
            'usage_limit'           => 'required|integer|min:1',
            'min_spend'             => 'required|numeric|min:0',
            'discount'              => 'required|numeric|max:100|min:1',
            'for_inactive_users'    => 'required|boolean',
            'for_new_users'         => 'required|boolean',
            'additional_info'       => 'nullable|string|max:500',
            'start_date'            => 'required|date|after_or_equal:today',
            'end_date'              => 'required|date|after_or_equal:start_date',
            'generic'               => 'required|boolean',
            'active'                => 'required|boolean',
        ];
    }

    //Define the messages for each specific error
    public function messages(): array
    {
        return [
            'description.required'          => 'A descrição é um campo obrigatório.',
            'description.string'            => 'A descrição tem de ser um texto',
            'description.max'               => 'A descrição não pode ter mais de 100 caracteres.',
            'description.min'               => 'A descrição deve ter pelo menos 5 caracteres.',

            'promo_code.required'           => 'O código é um campo obrigatório.',
            'promo_code.string'             => 'O código deve ser um texto.',
            'promo_code.max'                => 'O código não pode ter mais de 20 caracteres.',
            'promo_code.min'                => 'O código deve ter pelo menos 2 caracteres.',
            'promo_code.unique'             => 'O código promocional já existe.',

            'usage_limit.required'          => 'O limite de uso é um campo obrigatório.',
            'usage_limit.integer'           => 'O limite de uso deve ser um número.',
            'usage_limit.min'               => 'O limite de uso deve ser pelo menos 1.',

            'min_spend.required'            => 'O gasto mínimo é um campo obrigatório.',
            'min_spend.numeric'             => 'O gasto mínimo deve ser um número.',
            'min_spend.min'                 => 'O gasto mínimo não pode ser menor que 0.',

            'discount.required'             => 'O desconto é um campo obrigatório.',
            'discount.numeric'              => 'O desconto deve ser um número.',
            'discount.min'                  => 'O desconto deve ser pelo menos 1.',
            'discount.max'                  => 'O desconto não pode ser maior que 100%.',

            'for_inactive_users.boolean'    => 'Utilizadores inativos deve ser verdadeiro ou falso.',

            'for_new_users.boolean'         => 'Novos utilizadores deve ser verdadeiro ou falso.',

            'additional_info.string'        => 'As informações adicionais devem ser um texto.',
            'additional_info.max'           => 'As informações adicionais não podem ter mais de 500 caracteres.',

            'start_date.required'           => 'A data de início é obrigatória.',
            'start_date.date'               => 'A data tem de ter um formato válido.',
            'start_date.after_or_equal'     => 'A data de início tem de ser a atual ou superior.',
            'start_date.before_or_equal'    => 'A data de início deve ser anterior ou igual à data de fim.',

            'end_date.required'             => 'A data de fim é obrigatória.',
            'end_date.date'                 => 'A data tem de ter um formato válido.',
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
