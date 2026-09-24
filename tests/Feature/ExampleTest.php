<?php

test('the home page introduces the dining room', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('home'));
});
