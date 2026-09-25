<?php

use App\Models\User;
use Database\Seeders\TableSeeder;

test('staff tables page receives dining tables from the database', function () {
    $this->seed(TableSeeder::class);
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get(route('staff.tables'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('staff/tables')
            ->has('tables', 5)
            ->where('tables.0.name', 'Table 1')
            ->where('tables.0.capacity', 2)
            ->where('tables.4.name', 'Table 5')
            ->where('tables.4.capacity', 6)
        );
});
