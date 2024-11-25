<?php

namespace Database\Seeders;

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

        User::factory()->create([
            'username'  => 'SuperAdmin',
            'email'     => 'super@padelconnect.com',
            'nif'       => 999999999,
            'role_id'   => 1,
            'password'  => Hash::make('Az123456!'),
        ]);
    }
}
