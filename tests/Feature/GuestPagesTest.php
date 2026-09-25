<?php

test('the menu page returns 200 and renders the menu component', function () {
    $this->get('/menu')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('menu'));
});

test('the menu page can be visited via named route', function () {
    $this->get(route('menu'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('menu'));
});

test('the private dining page returns 200 and renders the private component', function () {
    $this->get('/private')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('private'));
});

test('the private dining page can be visited via named route', function () {
    $this->get(route('private'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('private'));
});

test('the about page returns 200 and renders the about component', function () {
    $this->get('/about')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('about'));
});

test('the about page can be visited via named route', function () {
    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('about'));
});

test('the contact page returns 200 and renders the contact component', function () {
    $this->get('/contact')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('contact'));
});

test('the contact page can be visited via named route', function () {
    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('contact'));
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
