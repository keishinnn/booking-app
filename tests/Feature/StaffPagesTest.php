<?php

test('the staff entry point redirects to staff dashboard', function () {
    $this->get('/staff')
        ->assertRedirect('/staff/dashboard');
});

test('the staff dashboard page returns 200 and renders staff/dashboard component', function () {
    $this->get('/staff/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/dashboard'));
});

test('the staff dashboard can be visited via named route', function () {
    $this->get(route('staff.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/dashboard'));
});

test('the staff reservations page returns 200 and renders staff/reservations component', function () {
    $this->get('/staff/reservations')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/reservations'));
});

test('the staff reservations can be visited via named route', function () {
    $this->get(route('staff.reservations'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/reservations'));
});

test('the staff tables page returns 200 and renders staff/tables component', function () {
    $this->get('/staff/tables')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/tables'));
});

test('the staff tables can be visited via named route', function () {
    $this->get(route('staff.tables'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('staff/tables'));
});
