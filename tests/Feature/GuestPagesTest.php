<?php

test('the home page returns 200 and renders the home component', function () {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('home'));
});

test('the home page can be visited via named route', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('home'));
});

test('the terms page returns 200 and renders the terms component', function () {
    $this->get('/terms')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('terms'));
});

test('the terms page can be visited via named route', function () {
    $this->get(route('terms'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('terms'));
});

test('the privacy page returns 200 and renders the privacy component', function () {
    $this->get('/privacy')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('privacy'));
});

test('the privacy page can be visited via named route', function () {
    $this->get(route('privacy'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('privacy'));
});

test('the login page returns 200 and renders the login component', function () {
    $this->get('/login')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('login'));
});

test('the login page can be visited via named route', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('login'));
});

test('a login attempt returns redirect back', function () {
    $this->from('/login')
        ->post('/login', [
            'email' => 'staff@halden.test',
            'password' => 'password',
        ])
        ->assertRedirect('/login')
        ->assertSessionHas('error', 'Staff authentication requires active database connection.');
});

test('the reserve page returns 200 and renders the book component', function () {
    $this->get('/reserve')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('book')
            ->has('filters')
            ->where('filters.date', null)
            ->where('filters.party_size', null)
            ->where('filters.starts_at', null)
            ->where('tables', [])
        );
});

test('the reserve page can be visited via named route', function () {
    $this->get(route('reserve'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('book'));
});

test('the reserve page returns expected tables in inertia props when filtered', function () {
    $this->get('/reserve?date=2026-09-25&party_size=2&starts_at=19:00')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('book')
            ->where('filters.date', '2026-09-25')
            ->where('filters.party_size', 2)
            ->where('filters.starts_at', '19:00')
            ->has('tables', 5)
            ->where('tables.0.name', 'Table 1')
            ->where('tables.0.capacity', 2)
        );
});

test('the reserve page filters out tables smaller than party size', function () {
    $this->get('/reserve?date=2026-09-25&party_size=5&starts_at=19:00')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('book')
            ->where('filters.party_size', 5)
            ->has('tables', 1)
            ->where('tables.0.name', 'Table 5')
            ->where('tables.0.capacity', 6)
        );
});

test('a reservation can be posted to the reservations stub endpoint', function () {
    $this->post('/reservations', [
        'table_id' => 1,
        'reserved_on' => '2026-09-25',
        'starts_at' => '19:00',
        'party_size' => 2,
        'guest_name' => 'Sara Lindqvist',
        'email' => 'sara@example.com',
        'phone' => '+46 70 123 4567',
    ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Table reserved successfully.');
});

test('the staff entry point redirects to staff dashboard', function () {
    $this->get('/staff')
        ->assertRedirect('/staff/dashboard');
});

test('the staff dashboard page returns 200 and renders the staff/dashboard component', function () {
    $this->get('/staff/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/dashboard'));
});

test('the staff dashboard page can be visited via named route', function () {
    $this->get(route('staff.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/dashboard'));
});
