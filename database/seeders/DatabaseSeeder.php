<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->staff()->create([
            'name' => 'Floor Staff',
            'email' => 'staff@halden.test',
        ]);

        User::factory()->admin()->create([
            'name' => 'Halden Admin',
            'email' => 'admin@halden.test',
        ]);
    }
}
