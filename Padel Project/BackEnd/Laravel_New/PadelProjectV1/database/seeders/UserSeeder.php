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
                'username'  => 'Cliente',
                'email'     => 'cliente@padelconnect.com',
                'birthday'  => '2000-01-01',
                'nif'       => 223153346,
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
