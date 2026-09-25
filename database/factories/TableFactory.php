<?php

namespace Database\Factories;

use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Table>
 */
class TableFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Table '.fake()->unique()->numberBetween(1, 99),
            'capacity' => fake()->randomElement([2, 4, 6]),
            'image_url' => '/images/dining-table.png',
        ];
    }
}
