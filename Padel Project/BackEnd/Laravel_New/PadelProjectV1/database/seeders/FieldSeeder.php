<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FieldSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fields = [
            [
                'company_id'     => 1,
                'name'           => 'Campo de Padel S',
                'price_hour'     => '9.90',
                'type_floor'     => 'Piso Cimento',
                'status'         => 'Disponivel',
                'illumination'   => true,
                'cover'          => true,
                'shower_room'    => true,
                'lockers'        => true,
                'rent_equipment' => false,
            ],
            [
                'company_id'     => 1,
                'name'           => 'Campo de Padel M',
                'price_hour'     => '12.50',
                'type_floor'     => 'Piso Relva Sintética',
                'status'         => 'Disponivel',
                'illumination'   => true,
                'cover'          => false,
                'shower_room'    => false,
                'lockers'        => false,
                'rent_equipment' => true,
            ],
            [
                'company_id'     => 2,
                'name'           => 'Campo de Padel L',
                'price_hour'     => '15.00',
                'type_floor'     => 'Piso Madeira',
                'status'         => 'Indisponivel',
                'illumination'   => false,
                'cover'          => true,
                'shower_room'    => true,
                'lockers'        => true,
                'rent_equipment' => true,
            ],
            [
                'company_id'     => 2,
                'name'           => 'Campo de Padel XL',
                'price_hour'     => '18.00',
                'type_floor'     => 'Piso Acrílico',
                'status'         => 'Disponivel',
                'illumination'   => true,
                'cover'          => false,
                'shower_room'    => true,
                'lockers'        => true,
                'rent_equipment' => false,
            ],
            [
                'company_id'     => 3,
                'name'           => 'Campo de Padel XXL',
                'price_hour'     => '20.00',
                'type_floor'     => 'Piso Cimento',
                'status'         => 'Inativo',
                'illumination'   => true,
                'cover'          => true,
                'shower_room'    => false,
                'lockers'        => true,
                'rent_equipment' => false,
            ],
            [
                'company_id'     => 3,
                'name'           => 'Campo de Padel XXXL',
                'price_hour'     => '22.50',
                'type_floor'     => 'Piso Relva Sintética',
                'status'         => 'Disponivel',
                'illumination'   => false,
                'cover'          => false,
                'shower_room'    => false,
                'lockers'        => false,
                'rent_equipment' => false,
            ],
        ];

        foreach ($fields as $field) {
            $fieldId = DB::table('fields')->insertGetId($field);

            $weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            foreach ($weekdays as $day) {
                DB::table('field_schedule')->insert([
                    'field_id'    => $fieldId,
                    'day_of_week' => $day,
                    'opening_time'=> '09:00',
                    'closing_time'=> '20:00',
                    'is_closed'   => false,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            DB::table('field_schedule')->insert([
                'field_id'    => $fieldId,
                'day_of_week' => 'saturday',
                'opening_time'=> '10:00',
                'closing_time'=> '20:00',
                'is_closed'   => false,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            DB::table('field_schedule')->insert([
                'field_id'    => $fieldId,
                'day_of_week' => 'sunday',
                'opening_time'=> null,
                'closing_time'=> null,
                'is_closed'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }
}
