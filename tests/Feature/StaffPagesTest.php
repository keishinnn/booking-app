<?php

use App\Models\User;

test('guests are redirected from staff pages to login', function () {
    $this->get('/staff')->assertRedirect(route('login'));
    $this->get(route('staff.dashboard'))->assertRedirect(route('login'));
    $this->get(route('staff.reservations'))->assertRedirect(route('login'));
    $this->get(route('staff.tables'))->assertRedirect(route('login'));
});

test('authenticated staff can visit staff pages', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get('/staff')
        ->assertRedirect('/staff/dashboard');

    $this->actingAs($user)
        ->get(route('staff.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/dashboard'));

    $this->actingAs($user)
        ->get(route('staff.reservations'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/reservations'));

    $this->actingAs($user)
        ->get(route('staff.tables'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/tables'));
});
