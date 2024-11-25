<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('payment_methods')->insert([
            [
                'description' => 'No Ato',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'description' => 'MBWay',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'description' => 'Cartão Crédito',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'description' => 'PayPal',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
