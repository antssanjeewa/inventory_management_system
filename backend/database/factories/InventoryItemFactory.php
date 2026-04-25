<?php

namespace Database\Factories;

use App\Models\Place;
use App\Enums\ItemStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'item_name' => $this->faker->words(3, true),
            'code' => $this->faker->unique()->bothify('ITEM-####'),
            'quantity' => $this->faker->numberBetween(1, 100),
            'serial_number' => $this->faker->uuid(),
            'description' => $this->faker->sentence(),
            'place_id' => Place::factory(),
            'status' => $this->faker->randomElement(ItemStatus::cases()),
        ];
    }
}
