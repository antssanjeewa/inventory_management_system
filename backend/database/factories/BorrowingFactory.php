<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Borrowing>
 */
class BorrowingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'inventory_item_id' => InventoryItem::factory(),
            'borrower_name' => $this->faker->name(),
            'contact' => $this->faker->phoneNumber(),
            'borrow_date' => now(),
            'expected_return_date' => now()->addDays(7),
            'quantity' => 1,
            'status' => 'Borrowed',
        ];
    }
}
