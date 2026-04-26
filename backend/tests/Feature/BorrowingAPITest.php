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
    $borrowing = Borrowing::factory()->make();

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/borrowings', [
            'inventory_item_id' => $item->id,
            'borrower_name' => $borrowing->borrower_name,
            'contact' => $borrowing->contact,
            'borrow_date' => now()->toDateString(),
            'expected_return_date' => now()->addDays(2)->toDateString(),
            'quantity' => 2,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', "Item borrowed successfully");


    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'quantity' => 8,
    ]);

    $this->assertDatabaseHas('borrowings', [
        'inventory_item_id' => $item->id,
        'borrower_name' => $borrowing->borrower_name,
        'contact' => $borrowing->contact,
        'status' => 'Borrowed',
        'quantity' => 2,
        'borrow_date' => now()->toDateString(),
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Item Borrowed',
        'user_id' => $this->user->id,
        'entity_type' => Borrowing::class
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Quantity Changed',
        'user_id' => $this->user->id,
        'entity_type' => InventoryItem::class,
        'entity_id' => $item->id
    ]);
});

test('can borrow an item with state change', function () {
    $item = InventoryItem::factory()->create(['quantity' => 1]);
    $borrowing = Borrowing::factory()->make();

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/borrowings', [
            'inventory_item_id' => $item->id,
            'borrower_name' => $borrowing->borrower_name,
            'contact' => $borrowing->contact,
            'borrow_date' => now()->toDateString(),
            'expected_return_date' => now()->addDays(2)->toDateString(),
            'quantity' => 1,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', "Item borrowed successfully");


    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'quantity' => 0,
        'status' => 'Borrowed'
    ]);

    $this->assertDatabaseHas('borrowings', [
        'inventory_item_id' => $item->id,
        'borrower_name' => $borrowing->borrower_name,
        'contact' => $borrowing->contact,
        'status' => 'Borrowed',
        'quantity' => 1,
        'borrow_date' => now()->toDateString(),
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Item Borrowed',
        'user_id' => $this->user->id,
        'entity_type' => Borrowing::class
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Status Changed',
        'user_id' => $this->user->id,
        'entity_type' => InventoryItem::class,
        'entity_id' => $item->id
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Quantity Changed',
        'user_id' => $this->user->id,
        'entity_type' => InventoryItem::class,
        'entity_id' => $item->id
    ]);
});

test('cannot borrow if insufficient stock', function () {
    $item = InventoryItem::factory()->create(['quantity' => 1]);
    $borrowing = Borrowing::factory()->make();

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/borrowings', [
            'inventory_item_id' => $item->id,
            'borrower_name' => $borrowing->borrower_name,
            'contact' => $borrowing->contact,
            'borrow_date' => now()->toDateString(),
            'expected_return_date' => now()->addDays(2)->toDateString(),
            'quantity' => 2,
        ]);

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonPath('message', 'Insufficient stock available.');
});

test('can return a borrowed item', function () {
    $item = InventoryItem::factory()->create([
        'quantity' => 0,
        'status' => 'Borrowed'
    ]);
    $borrowing = Borrowing::factory()->create([
        'inventory_item_id' => $item->id,
        'quantity' => 2,
        'status' => 'Borrowed',
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson('/api/borrowings/' . $borrowing->id, [
            'status' => 'Returned'
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', "Borrowing status updated successfully");


    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'quantity' => 2,
        'status' => 'In-Store'
    ]);

    $this->assertDatabaseHas('borrowings', [
        'id' => $borrowing->id,
        'status' => 'Returned',
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Item Returned',
        'user_id' => $this->user->id,
        'entity_type' => Borrowing::class
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Status Changed',
        'user_id' => $this->user->id,
        'entity_type' => InventoryItem::class,
        'entity_id' => $item->id
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Quantity Changed',
        'user_id' => $this->user->id,
        'entity_type' => InventoryItem::class,
        'entity_id' => $item->id
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
