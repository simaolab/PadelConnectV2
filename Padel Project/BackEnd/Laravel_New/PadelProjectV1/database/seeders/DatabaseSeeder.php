<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(NationalitySeeder::class);
        $this->call(PaymentMethodSeeder::class);
        $this->call(CompanySeeder::class);
        $this->call(FieldSeeder::class);

        User::factory()->create(
            [
                'username'  => 'Norberto',
                'email'     => 'norberto@padelconnect.com',
                'birthday'  => '01/01/2000',
                'nif'       => 999999991,
                'role_id'   => 1,
                'password'  => Hash::make('Az123456!'),
            ],
        );

        Client::factory()->create(
            [
                'user_id'           => 1,
                'first_name'        => 'Norberto',
                'last_name'         => 'Moreira',
            ],
        );

        User::factory()->create(
            [
                'username'  => 'Gestor',
                'email'     => 'gestor@padelconnect.com',
                'birthday'  => '01/01/2000',
                'nif'       => 999999992,
                'role_id'   => 2,
                'password'  => Hash::make('Az123456!'),
            ],
        );

        Client::factory()->create(
            [
                'user_id'           => 2,
                'first_name'        => 'Gestor',
                'last_name'         => 'Teste',
            ],
        );

        User::factory()->create(
            [
                'username'  => 'Cliente',
                'email'     => 'cliente@padelconnect.com',
                'birthday'  => '01/01/2000',
                'nif'       => 999999993,
                'role_id'   => 3,
                'password'  => Hash::make('Az123456!'),
            ],
        );

        Client::factory()->create(
            [
                'user_id'           => 3,
                'first_name'        => 'Cliente',
                'last_name'         => 'Teste',
            ],
        );
    }
}
