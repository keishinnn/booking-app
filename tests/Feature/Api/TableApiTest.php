<?php

use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;

test('guests cannot access the tables api', function () {
    $this->getJson('/api/tables')->assertUnauthorized();
});

test('staff can list and show tables via the api', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['name' => 'Table API 1']);

    $this->actingAs($user)
        ->getJson('/api/tables')
        ->assertOk()
        ->assertJsonFragment(['name' => 'Table API 1']);

    $this->actingAs($user)
        ->getJson("/api/tables/{$table->id}")
        ->assertOk()
        ->assertJsonPath('data.name', 'Table API 1');
});

test('staff cannot mutate tables via the api', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/tables', [
            'name' => 'Blocked Table',
            'capacity' => 2,
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->putJson("/api/tables/{$table->id}", [
            'name' => 'Blocked Rename',
            'capacity' => 4,
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->deleteJson("/api/tables/{$table->id}")
        ->assertForbidden();
});

test('admins can create update and delete tables via the api', function () {
    $user = User::factory()->admin()->create();

    $create = $this->actingAs($user)
        ->postJson('/api/tables', [
            'name' => 'Table API New',
            'capacity' => 4,
            'image_url' => '/images/dining-table.png',
        ])
        ->assertCreated()
        ->assertJsonPath('data.name', 'Table API New');

    $tableId = $create->json('data.id');

    $this->actingAs($user)
        ->putJson("/api/tables/{$tableId}", [
            'name' => 'Table API Updated',
            'capacity' => 6,
            'image_url' => '/images/long-table.png',
        ])
        ->assertOk()
        ->assertJsonPath('data.name', 'Table API Updated')
        ->assertJsonPath('data.capacity', 6);

    $this->assertDatabaseHas('tables', [
        'id' => $tableId,
        'name' => 'Table API Updated',
        'capacity' => 6,
    ]);

    $this->actingAs($user)
        ->deleteJson("/api/tables/{$tableId}")
        ->assertNoContent();

    $this->assertDatabaseMissing('tables', ['id' => $tableId]);
});

test('admins cannot delete a table that has reservations', function () {
    $user = User::factory()->admin()->create();
    $table = Table::factory()->create();
    Reservation::factory()->create(['table_id' => $table->id]);

    $this->actingAs($user)
        ->deleteJson("/api/tables/{$table->id}")
        ->assertConflict();

    $this->assertDatabaseHas('tables', ['id' => $table->id]);
});
