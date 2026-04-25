<?php

use App\Models\Cupboard;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});


test('can fetch all cupboards', function () {
    Cupboard::factory()->count(3)->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/cupboards');

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data');
});

test('check validation error when creating a cupboard', function () {
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/cupboards');

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonValidationErrors(['name']);

});

test('can create a new cupboard', function () {
    $cupboard = Cupboard::factory()->make();

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/cupboards', [
            'name' => $cupboard->name
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Cupboard created successfully')
        ->assertJsonPath('data.name', $cupboard->name);

    $this->assertDatabaseHas('cupboards', [
        'name' => $cupboard->name
    ]);
});

test('check validation error when updating a cupboard', function () {
    $cupboard = Cupboard::factory()->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson('/api/cupboards/' . $cupboard->id);

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonValidationErrors(['name']);

});

test('can update a exist cupboard', function () {
    $cupboard = Cupboard::factory()->create();
    $new_cupboard_name = "Updated Cupboard";

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson('/api/cupboards/' . $cupboard->id, [
            'name' => $new_cupboard_name
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Cupboard updated successfully')
        ->assertJsonPath('data.name', $new_cupboard_name);

    $this->assertDatabaseHas('cupboards', [
        'name' => $new_cupboard_name
    ]);
});

test('can delete a exist cupboard', function () {
    $cupboard = Cupboard::factory()->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->deleteJson('/api/cupboards/' . $cupboard->id);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Cupboard deleted successfully');

    $this->assertSoftDeleted('cupboards', [
        'id' => $cupboard->id
    ]);
});

test('unauthenticated users cannot access cupboards', function () {
    $response = $this->getJson('/api/cupboards');

    $response->assertStatus(401);
});
