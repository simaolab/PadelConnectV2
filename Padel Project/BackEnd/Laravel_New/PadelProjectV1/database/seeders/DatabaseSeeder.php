<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
        $this->call(PromotionSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(ClientSeeder::class);
    }
}