<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;

class NifValidationRule implements ValidationRule
{
    /**
     * Executa a validação.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        // Verifica se o valor é numérico e tem 9 dígitos
        if (!is_numeric($value) || strlen($value) !== 9) {
            $fail("O campo :attribute deve conter exatamente 9 dígitos.");
            return;
        }

        // Converte o valor em um array de dígitos
        $digits = str_split($value);

        // O primeiro dígito deve estar entre os valores válidos
        $firstDigit = (int)$digits[0];
        if (!in_array($firstDigit, [1, 2, 3, 5, 6, 8, 9])) {
            $fail("O campo :attribute contém um número de identificação fiscal inválido.");
            return;
        }

        // Valida o checksum (módulo 11)
        $sum = 0;
        for ($i = 0; $i < 8; $i++) {
            $sum += $digits[$i] * (9 - $i);
        }

        $checksum = 11 - ($sum % 11);
        $checksum = $checksum >= 10 ? 0 : $checksum;

        if ($checksum !== (int)$digits[8]) {
            $fail("O :attribute inserido não é válido.");
        }
    }
}
