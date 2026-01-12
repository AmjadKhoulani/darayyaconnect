<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['outage', 'danger', 'waste', 'maintenance']),
            'description' => $this->faker->sentence(),
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'status' => 'received',
            'is_anonymous' => true,
        ];
    }
}
