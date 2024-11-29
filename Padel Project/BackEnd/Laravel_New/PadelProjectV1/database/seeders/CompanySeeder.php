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
                'address'   => 'Rua do Ouro, 100, 4000-200, Porto',
                'name'      => 'PadelConnect',
                'email'     => 'empresa1@padelconnect.pt',
                'nif'       => 510000001,
            ],
            [
                'address'   => 'Avenida da Liberdade, 200, 2000-200, Lisboa',
                'name'      => 'PadelPro',
                'email'     => 'empresa2@padelpro.pt',
                'nif'       => 510000002,
            ],
            [
                'address'   => 'Praça do Comércio, 300 , 3000-200, Coimbra',
                'name'      => 'PadelMaster',
                'email'     => 'empresa3@padelmaster.pt',
                'nif'       => 510000003,
            ],
        ]);
    }
}
