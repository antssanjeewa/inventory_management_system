<?php

use App\Models\Borrowing;
use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('can fetch all borrowings', function () {
    Borrowing::factory()->count(3)->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/borrowings');

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data');
});

test('can borrow an item', function () {
    $item = InventoryItem::factory()->create(['quantity' => 10]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/borrowings', [
            'inventory_item_id' => $item->id,
            'borrower_name' => 'John Doe',
            'contact' => '123456789',
            'borrow_date' => now()->toDateString(),
            'expected_return_date' => now()->addDays(2)->toDateString(),
            'quantity' => 2,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('success', true);

    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'quantity' => 8,
    ]);
});

test('cannot borrow if insufficient stock', function () {
    $item = InventoryItem::factory()->create(['quantity' => 1]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/borrowings', [
            'inventory_item_id' => $item->id,
            'borrower_name' => 'John Doe',
            'contact' => '123456789',
            'borrow_date' => now()->toDateString(),
            'expected_return_date' => now()->addDays(2)->toDateString(),
            'quantity' => 2,
        ]);

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonPath('message', 'Insufficient stock available.');
});

test('can return a borrowed item', function () {
    $item = InventoryItem::factory()->create(['quantity' => 5]);
    $borrowing = Borrowing::factory()->create([
        'inventory_item_id' => $item->id,
        'quantity' => 2,
        'status' => 'Borrowed',
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson('/api/borrowings/' . $borrowing->id, [
            'status' => 'Returned',
            'inventory_item_id' => $item->id,
            'borrower_name' => $borrowing->borrower_name,
            'contact' => $borrowing->contact,
            'borrow_date' => $borrowing->borrow_date,
        ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'quantity' => 7,
    ]);

    $this->assertDatabaseHas('borrowings', [
        'id' => $borrowing->id,
        'status' => 'Returned',
    ]);
});

test('can fetch borrowings by item', function () {
    $item = InventoryItem::factory()->create();
    Borrowing::factory()->count(2)->create(['inventory_item_id' => $item->id]);
    Borrowing::factory()->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson("/api/inventory-items/{$item->id}/borrowings");

    $response->assertStatus(200)
        ->assertJsonCount(2, 'data');
});
