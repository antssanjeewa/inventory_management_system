<?php

use App\Models\User;
use App\Models\InventoryItem;
use App\Models\Place;
use App\Models\Borrowing;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('can fetch dashboard stats', function () {
    InventoryItem::factory()->count(2)->create();
    Place::factory()->count(3)->create();
    Borrowing::factory()->create(['status' => 'Borrowed']);

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/dashboard');

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.stats.total_items', InventoryItem::count())
        ->assertJsonPath('data.stats.total_places', Place::count());
});
