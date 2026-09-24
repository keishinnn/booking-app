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
