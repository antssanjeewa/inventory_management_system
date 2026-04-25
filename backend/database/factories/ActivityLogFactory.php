<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'action' => 'Item Created',
            'entity_type' => 'App\Models\InventoryItem',
            'entity_id' => 1,
            'old_values' => null,
            'new_values' => ['name' => 'Test Item'],
            'created_at' => now(),
        ];
    }
}
