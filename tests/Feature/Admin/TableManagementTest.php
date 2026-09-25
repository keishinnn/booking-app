<?php

use App\Models\Table;
use App\Models\User;
use Database\Seeders\TableSeeder;

test('admins can view the tables index with seeded tables', function () {
    $this->seed(TableSeeder::class);
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('admin.tables.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/tables/index')
            ->has('tables', 5)
            ->has('imageOptions')
        );
});

test('staff cannot access admin table management', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get(route('admin.tables.index'))
        ->assertForbidden();
});

test('admins can create a table', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post(route('admin.tables.store'), [
            'name' => 'Table 9',
            'capacity' => 3,
            'image_url' => '/images/lunch.png',
        ])
        ->assertRedirect(route('admin.tables.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('tables', [
        'name' => 'Table 9',
        'capacity' => 3,
        'image_url' => '/images/lunch.png',
    ]);
});

test('admins can update a table', function () {
    $user = User::factory()->admin()->create();
    $table = Table::factory()->create([
        'name' => 'Table Edit',
        'capacity' => 2,
    ]);

    $this->actingAs($user)
        ->put(route('admin.tables.update', $table), [
            'name' => 'Table Edited',
            'capacity' => 8,
            'image_url' => '/images/long-table.png',
        ])
        ->assertRedirect(route('admin.tables.index'));

    $this->assertDatabaseHas('tables', [
        'id' => $table->id,
        'name' => 'Table Edited',
        'capacity' => 8,
    ]);
});

test('admins can delete a table without reservations', function () {
    $user = User::factory()->admin()->create();
    $table = Table::factory()->create(['name' => 'Table Delete']);

    $this->actingAs($user)
        ->delete(route('admin.tables.destroy', $table))
        ->assertRedirect(route('admin.tables.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('tables', ['id' => $table->id]);
});
