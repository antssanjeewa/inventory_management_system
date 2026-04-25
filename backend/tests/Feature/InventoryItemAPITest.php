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
    $place = Place::factory()->create();
    $image = UploadedFile::fake()->image('item.jpg');

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/inventory-items', [
            'item_name' => 'New Item',
            'code' => 'CODE-123',
            'quantity' => 10,
            'place_id' => $place->id,
            'status' => 'In-Store',
            'image' => $image,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('success', true);

    $this->assertDatabaseHas('inventory_items', [
        'item_name' => 'New Item',
        'code' => 'CODE-123',
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
    
    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson('/api/inventory-items/' . $item->id, [
            'item_name' => 'Updated Name',
            'code' => $item->code,
            'quantity' => 5,
            'place_id' => $item->place_id,
            'status' => 'In-Store',
        ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('inventory_items', [
        'id' => $item->id,
        'item_name' => 'Updated Name',
    ]);
});

test('can delete an inventory item', function () {
    $item = InventoryItem::factory()->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->deleteJson('/api/inventory-items/' . $item->id);

    $response->assertStatus(200);
    $this->assertSoftDeleted('inventory_items', [
        'id' => $item->id,
    ]);
});
