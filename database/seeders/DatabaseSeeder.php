<?php

namespace Database\Seeders;

use App\Enums\UserRole;
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
        User::query()->updateOrCreate(
            ['email' => 'staff@halden.test'],
            [
                'name' => 'Floor Staff',
                'password' => 'password',
                'role' => UserRole::Staff,
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'admin@halden.test'],
            [
                'name' => 'Halden Admin',
                'password' => 'password',
                'role' => UserRole::Admin,
            ],
        );

        $this->call(TableSeeder::class);
    }
}
