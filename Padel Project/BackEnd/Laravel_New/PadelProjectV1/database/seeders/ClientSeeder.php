<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('clients')->insert([
            [
                'user_id' => '1',
                'first_name' => 'Norberto',
                'last_name' => 'Moreira',
            ],
            [
                'user_id' => '2',
                'first_name' => 'Gestor',
                'last_name' => 'Teste',
            ],
            [
                'user_id' => '3',
                'first_name' => 'Cliente',
                'last_name' => 'Teste',
            ],
       ]);
    }
}
