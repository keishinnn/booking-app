<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');
Route::inertia('/menu', 'menu')->name('menu');
Route::inertia('/private', 'private')->name('private');
Route::inertia('/about', 'about')->name('about');
Route::inertia('/contact', 'contact')->name('contact');
Route::inertia('/terms', 'terms')->name('terms');
