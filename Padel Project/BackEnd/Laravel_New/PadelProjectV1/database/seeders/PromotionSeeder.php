<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('promotions')->insert([

            [
                'description'   => 'Promoção de Natal',
                'promo_code'    => 'NATALPADEL2024',
                'discount'      => 10,
                'start_date'    => '2024-12-01',    
                'end_date'      => '2024-12-31',
                'for_new_users' => true,
                'generic'       => false,
            ],
        ]);
    }
}
