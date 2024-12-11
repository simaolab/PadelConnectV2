<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'username'  => 'Norberto',
                'email'     => 'norberto@padelconnect.com',
                'birthday'  => '2000-01-01',
                'nif'       => 223253340,
                'role_id'   => 1,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'Rafael',
                'email'     => 'rafael.costa.t0127545@edu.atec.pt',
                'birthday'  => '2005-10-30',
                'nif'       => 273303333,
                'role_id'   => 3,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'Simão',
                'email'     => 'simao.correia.t0127546@edu.atec.pt',
                'birthday'  => '1999-02-22',
                'nif'       => 266999344,
                'role_id'   => 3,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'Catarina',
                'email'     => 'catarina.lopes.t0127533@edu.atec.pt',
                'birthday'  => '2000-01-01',
                'nif'       => 250948818,
                'role_id'   => 3,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'Afonso',
                'email'     => 'afonso.fereira.t0127531@edu.atec.pt',
                'birthday'  => '2004-05-02',
                'nif'       => 252993942,
                'role_id'   => 3,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'Hélder',
                'email'     => 'helder.fernandes.t0127540@edu.atec.pt',
                'birthday'  => '2004-05-02',
                'nif'       => 248286323,
                'role_id'   => 3,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'PadelConnect',
                'email'     => 'geral@padelconnect.com',
                'birthday'  => '2000-01-01',
                'nif'       => 500123456,
                'role_id'   => 2,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'PadelPro',
                'email'     => 'geral@padelpro.com',
                'birthday'  => '2000-01-01',
                'nif'       => 501987654,
                'role_id'   => 2,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'PadelMaster',
                'email'     => 'geral@padelmaster.com',
                'birthday'  => '2000-01-01',
                'nif'       => 502654321,
                'role_id'   => 2,
                'password'  => Hash::make('Az123456!'),
            ],
       ]);
    }
}
