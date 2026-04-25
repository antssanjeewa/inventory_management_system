<?php

use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});


test('can fetch all places', function () {
    Place::factory()->count(3)->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/places');

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonCount(3, 'data');
});

test('check validation error when creating a place', function () {
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/places');

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonValidationErrors(['name', 'cupboard_id']);

});

test('can create a new place', function () {
    $place = Place::factory()->make();

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/places', [
            'name' => $place->name,
            'cupboard_id' => $place->cupboard_id
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Place created successfully')
        ->assertJsonPath('data.name', $place->name)
        ->assertJsonPath('data.cupboard_id', $place->cupboard_id);

    $this->assertDatabaseHas('places', [
        'name' => $place->name,
        'cupboard_id' => $place->cupboard_id
    ]);
});

test('check validation error when updating a place', function () {
    $place = Place::factory()->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson('/api/places/' . $place->id);

    $response->assertStatus(422)
        ->assertJsonPath('success', false)
        ->assertJsonValidationErrors(['name', 'cupboard_id']);

});

test('can update a exist place', function () {
    $place = Place::factory()->create();
    $new_place_name = "Updated Place";

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson('/api/places/' . $place->id, [
            'name' => $new_place_name,
            'cupboard_id' => $place->cupboard_id
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Place updated successfully')
        ->assertJsonPath('data.name', $new_place_name)
        ->assertJsonPath('data.cupboard_id', $place->cupboard_id);

    $this->assertDatabaseHas('places', [
        'name' => $new_place_name,
        'cupboard_id' => $place->cupboard_id
    ]);
});

test('can delete a exist place', function () {
    $place = Place::factory()->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->deleteJson('/api/places/' . $place->id);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Place deleted successfully');

    $this->assertSoftDeleted('places', [
        'id' => $place->id
    ]);
});

test('unauthenticated users cannot access places', function () {
    $response = $this->getJson('/api/places');

    $response->assertStatus(401);
});
