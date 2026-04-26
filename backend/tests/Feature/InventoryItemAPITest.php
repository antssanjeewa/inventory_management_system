<?php

use App\Models\InventoryItem;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('can fetch all inventory items', function () {
    InventoryItem::factory()->count(3)->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/inventory-items');

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data');
});

test('can filter inventory items by search', function () {
    InventoryItem::factory()->create(['item_name' => 'Unique Gadget']);
    InventoryItem::factory()->create(['item_name' => 'Common Tool']);

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/inventory-items?search=Unique');

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.item_name', 'Unique Gadget');
});

test('can create a new inventory item', function () {
    Storage::fake('public');
    $item = InventoryItem::factory()->make();
    $place = Place::factory()->create();
    $image = UploadedFile::fake()->image('item.jpg');

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/inventory-items', [
            'item_name' => $item->item_name,
            'code' => $item->code,
            'quantity' => $item->quantity,
            'place_id' => $place->id,
            'status' => 'In-Store',
            'image' => $image,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', "Inventory item created successfully");

    $this->assertDatabaseHas('inventory_items', [
        'item_name' => $item->item_name,
        'code' => $item->code,
        'quantity' => $item->quantity,
        'status' => 'In-Store',
        'place_id' => $place->id
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Inventory Item Created',
        'user_id' => $this->user->id,
        'entity_type' => InventoryItem::class
    ]);
});

test('can fetch a single inventory item', function () {
    $item = InventoryItem::factory()->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/inventory-items/' . $item->id);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.id', $item->id);
});

test('can update an inventory item', function () {
    $item = InventoryItem::factory()->create(['item_name' => 'Old Name']);
    $updatedName = "'Updated Name'";

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson('/api/inventory-items/' . $item->id, [
            'item_name' => $updatedName,
            'code' => $item->code,
            'quantity' => 5,
            'place_id' => $item->place_id,
            'status' => 'In-Store',
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', "Inventory item updated successfully");


    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'item_name' => $updatedName,
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'Inventory Item Updated',
        'user_id' => $this->user->id,
        'entity_type' => InventoryItem::class,
        'entity_id' => $item->id
    ]);
});

test('can delete an inventory item', function () {
    $item = InventoryItem::factory()->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->deleteJson('/api/inventory-items/' . $item->id);

    $response->assertStatus(200)
        ->assertJsonPath('success', true);

    $this->assertSoftDeleted('inventory_items', [
        'id' => $item->id,
    ]);
});
