<?php

namespace Database\Factories;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'table_id' => Table::factory(),
            'guest_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'party_size' => fake()->numberBetween(1, 4),
            'reserved_on' => fake()->dateTimeBetween('now', '+2 weeks')->format('Y-m-d'),
            'starts_at' => fake()->randomElement(['11:00', '12:00', '13:00', '18:00', '19:00']),
            'status' => ReservationStatus::Confirmed,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReservationStatus::Cancelled,
        ]);
    }
}
