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
                'address'   => 'Rua do Ouro, 100',
                'name'      => 'PadelConnect',
                'email'     => 'empresa1@padelconnect.pt',
                'nif'       => 910000001,
            ],
            [
                'address'   => 'Avenida da Liberdade, 200',
                'name'      => 'PadelPro',
                'email'     => 'empresa2@padelpro.pt',
                'nif'       => 910000002,
            ],
            [
                'address'   => 'Praça do Comércio, 300',
                'name'      => 'PadelMaster',
                'email'     => 'empresa3@padelmaster.pt',
                'nif'       => 910000003,
            ],
        ]);
    }
}
