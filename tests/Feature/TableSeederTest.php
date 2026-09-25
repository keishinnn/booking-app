<?php

use App\Models\Table;
use Database\Seeders\TableSeeder;

test('the table seeder creates the five dining tables with public image paths', function () {
    $this->seed(TableSeeder::class);

    expect(Table::query()->count())->toBe(5);

    $this->assertDatabaseHas('tables', [
        'name' => 'Table 1',
        'capacity' => 2,
        'image_url' => '/images/dining-table.png',
    ]);

    $this->assertDatabaseHas('tables', [
        'name' => 'Table 5',
        'capacity' => 6,
        'image_url' => '/images/long-table.png',
    ]);

    Table::query()->each(function (Table $table): void {
        expect($table->image_url)->toStartWith('/images/');
        expect(public_path(ltrim($table->image_url, '/')))->toBeFile();
    });
});

test('the table seeder is idempotent when run twice', function () {
    $this->seed(TableSeeder::class);
    $this->seed(TableSeeder::class);

    expect(Table::query()->count())->toBe(5);
});
