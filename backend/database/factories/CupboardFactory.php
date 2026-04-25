<?php

namespace Database\Factories;

use App\Models\Cupboard;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cupboard>
 */
class CupboardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
        ];
    }
}
