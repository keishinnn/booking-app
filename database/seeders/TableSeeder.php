<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    /**
     * Seed the restaurant's dining tables from the local floor layout.
     *
     * Photos live in public/images and are referenced by public path in image_url.
     */
    public function run(): void
    {
        $tables = [
            [
                'name' => 'Table 1',
                'capacity' => 2,
                'image_url' => '/images/dining-table.png',
            ],
            [
                'name' => 'Table 2',
                'capacity' => 2,
                'image_url' => '/images/dining-room.png',
            ],
            [
                'name' => 'Table 3',
                'capacity' => 4,
                'image_url' => '/images/dining-table.png',
            ],
            [
                'name' => 'Table 4',
                'capacity' => 4,
                'image_url' => '/images/lunch.png',
            ],
            [
                'name' => 'Table 5',
                'capacity' => 6,
                'image_url' => '/images/long-table.png',
            ],
        ];

        foreach ($tables as $table) {
            Table::query()->updateOrCreate(
                ['name' => $table['name']],
                [
                    'capacity' => $table['capacity'],
                    'image_url' => $table['image_url'],
                ],
            );
        }
    }
}
