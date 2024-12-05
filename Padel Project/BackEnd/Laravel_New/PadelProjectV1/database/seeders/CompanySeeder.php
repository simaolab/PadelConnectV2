<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('companies')->insert([

            [
                'user_id'   => 3,
                'address'   => 'Rua do Ouro 100, 4000-200, Porto',
                'name'      => 'PadelConnect',
            ],
            [
                'user_id'   => 4,
                'address'   => 'Avenida da Liberdade 200, 2000-200, Lisboa',
                'name'      => 'PadelPro',
            ],
            [
                
                'user_id'   => 5,
                'address'   => 'Praça do Comércio 300 , 3000-200, Coimbra',
                'name'      => 'PadelMaster',
            ],
        ]);
    }
}
