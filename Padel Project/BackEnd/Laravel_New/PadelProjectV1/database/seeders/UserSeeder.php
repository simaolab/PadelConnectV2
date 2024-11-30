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
                'nif'       => 999999991,
                'role_id'   => 1,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'Gestor',
                'email'     => 'gestor@padelconnect.com',
                'birthday'  => '2000-01-01',
                'nif'       => 999999992,
                'role_id'   => 2,
                'password'  => Hash::make('Az123456!'),
            ],
            [
                'username'  => 'Cliente',
                'email'     => 'cliente@padelconnect.com',
                'birthday'  => '2000-01-01',
                'nif'       => 999999993,
                'role_id'   => 3,
                'password'  => Hash::make('Az123456!'),
            ],
       ]);
    }
}
