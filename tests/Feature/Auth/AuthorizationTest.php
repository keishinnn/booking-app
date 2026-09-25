<?php

use App\Models\User;

test('guests are redirected to login when visiting staff pages', function (string $route) {
    $this->get(route($route))
        ->assertRedirect(route('login'));
})->with([
    'dashboard' => 'staff.dashboard',
    'reservations' => 'staff.reservations',
    'tables' => 'staff.tables',
]);

test('guests are redirected to login when visiting admin pages', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});

test('staff can visit staff pages', function (string $route, string $component) {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get(route($route))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component($component));
})->with([
    'dashboard' => ['staff.dashboard', 'staff/dashboard'],
    'reservations' => ['staff.reservations', 'staff/reservations'],
    'tables' => ['staff.tables', 'staff/tables'],
]);

test('staff cannot visit admin pages', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('admins can visit staff and admin pages', function (string $route, string $component) {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route($route))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component($component));
})->with([
    'staff dashboard' => ['staff.dashboard', 'staff/dashboard'],
    'staff reservations' => ['staff.reservations', 'staff/reservations'],
    'staff tables' => ['staff.tables', 'staff/tables'],
    'admin dashboard' => ['admin.dashboard', 'admin/dashboard'],
]);

test('the staff entry point redirects authenticated staff to the dashboard', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get('/staff')
        ->assertRedirect('/staff/dashboard');
});

test('the admin entry point redirects authenticated admins to the dashboard', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get('/admin')
        ->assertRedirect('/admin/dashboard');
});
