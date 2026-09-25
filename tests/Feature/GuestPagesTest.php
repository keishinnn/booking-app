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
