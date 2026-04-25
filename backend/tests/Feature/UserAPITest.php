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
    $response = $this->actingAs($this->admin, 'sanctum')
        ->postJson('/api/users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'staff',
        ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
});

test('admin can delete a user', function () {
    $userToDelete = User::factory()->create();

    $response = $this->actingAs($this->admin, 'sanctum')
        ->deleteJson('/api/users/' . $userToDelete->id);

    $response->assertStatus(200);
    $this->assertSoftDeleted('users', ['id' => $userToDelete->id]);
});

test('admin cannot delete themselves', function () {
    $response = $this->actingAs($this->admin, 'sanctum')
        ->deleteJson('/api/users/' . $this->admin->id);

    $response->assertStatus(400)
        ->assertJsonPath('message', 'Cannot delete itself');
});
