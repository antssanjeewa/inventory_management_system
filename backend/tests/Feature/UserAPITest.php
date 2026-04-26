<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->user = User::factory()->create();
});

test('admin can fetch all users', function () {
    $response = $this->actingAs($this->admin, 'sanctum')
        ->getJson('/api/users');

    $response->assertStatus(200)
        ->assertJsonPath('success', true);
});

test('non-admin cannot fetch users', function () {
    $response = $this->actingAs($this->user, 'sanctum')
        ->getJson('/api/users');

    $response->assertStatus(403);
});

test('admin can create a user', function () {
    $user = User::factory()->make();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->postJson('/api/users', [
            'name' => $user->name,
            'email' => $user->email,
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => $user->role,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', "User created successfully");


    $this->assertDatabaseHas('users', [
        'name' => $user->name,
        'email' => $user->email
    ]);

    $this->assertDatabaseHas('activity_logs', [
        'action' => 'User Created',
        'user_id' => $this->admin->id,
        'entity_type' => User::class
    ]);
});

test('admin can update a user', function () {
    $user = User::factory()->create();
    $updatedName = "Update Name";

    $response = $this->actingAs($this->admin, 'sanctum')
        ->putJson('/api/users/' . $user->id, [
            'name' => $updatedName,
            'email' => $user->email,
            'role' => $user->role,
        ]);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', "User updated successfully");

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'email' => $user->email,
        'name' => $updatedName
    ]);
});

test('admin can delete a user', function () {
    $userToDelete = User::factory()->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->deleteJson('/api/users/' . $userToDelete->id);

    $response->assertStatus(200)
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', "User deleted successfully");

    $this->assertSoftDeleted('users', ['id' => $userToDelete->id]);
});

test('admin cannot delete themselves', function () {
    $response = $this->actingAs($this->admin, 'sanctum')
        ->deleteJson('/api/users/' . $this->admin->id);

    $response->assertStatus(400)
        ->assertJsonPath('message', 'Cannot delete itself');
});
