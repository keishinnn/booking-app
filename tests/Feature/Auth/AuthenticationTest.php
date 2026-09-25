<?php

use App\Models\User;

test('guests can visit the login page', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('login'));
});

test('staff can authenticate and are redirected to the staff dashboard', function () {
    $user = User::factory()->staff()->create([
        'email' => 'staff@halden.test',
    ]);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])
        ->assertRedirect(route('staff.dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('admins can authenticate and are redirected to the admin dashboard', function () {
    $user = User::factory()->admin()->create([
        'email' => 'admin@halden.test',
    ]);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])
        ->assertRedirect(route('admin.dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('users cannot authenticate with an invalid password', function () {
    $user = User::factory()->staff()->create();

    $this->from(route('login'))
        ->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('authenticated users are redirected away from the login page', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get(route('login'))
        ->assertRedirect(route('staff.dashboard'));
});

test('authenticated users can log out', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect(route('login'));

    $this->assertGuest();
});
