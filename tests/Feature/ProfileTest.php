<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guests are redirected to login when visiting a profile', function () {
    $this->get(route('profile.edit'))
        ->assertRedirect(route('login'));
});

test('staff and admins can view their profile', function (UserRole $role) {
    $user = User::factory()->create([
        'name' => 'Amina Cole',
        'email' => 'amina@halden.test',
        'role' => $role,
    ]);

    $this->actingAs($user)
        ->get(route('profile.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('profile')
            ->where('profile.name', 'Amina Cole')
            ->where('profile.email', 'amina@halden.test')
            ->where('profile.role', $role->value)
            ->where('profile.is_only_admin', $role === UserRole::Admin)
        );
})->with([
    'staff' => [UserRole::Staff],
    'admin' => [UserRole::Admin],
]);

test('staff and admins can update their name and email', function (UserRole $role) {
    $user = User::factory()->create([
        'role' => $role,
        'email' => 'before@halden.test',
    ]);

    $this->actingAs($user)
        ->put(route('profile.update'), [
            'name' => 'Updated Name',
            'email' => 'after@halden.test',
            'role' => UserRole::Admin->value,
            'password' => 'replaced-password',
        ])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHas('success');

    $user->refresh();

    expect($user->name)->toBe('Updated Name')
        ->and($user->email)->toBe('after@halden.test')
        ->and($user->role)->toBe($role)
        ->and(Hash::check('password', $user->password))->toBeTrue();
})->with([
    'staff' => [UserRole::Staff],
    'admin' => [UserRole::Admin],
]);

test('updating a profile rejects a duplicate email', function () {
    $user = User::factory()->staff()->create(['email' => 'mine@halden.test']);
    User::factory()->staff()->create(['email' => 'taken@halden.test']);

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->put(route('profile.update'), [
            'name' => $user->name,
            'email' => 'taken@halden.test',
        ])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHasErrors([
            'email' => 'The email has already been taken.',
        ]);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'email' => 'mine@halden.test',
    ]);
});

test('updating a profile requires a name and email', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->put(route('profile.update'), [])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHasErrors(['name', 'email']);
});

test('staff and admins can change their password', function (UserRole $role) {
    $user = User::factory()->create(['role' => $role]);

    $this->actingAs($user)
        ->put(route('profile.password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHas('success');

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
    $this->assertAuthenticatedAs($user);
})->with([
    'staff' => [UserRole::Staff],
    'admin' => [UserRole::Admin],
]);

test('changing a password rejects the wrong current password', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->put(route('profile.password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHasErrors([
            'current_password' => 'The password is incorrect.',
        ]);

    expect(Hash::check('password', $user->refresh()->password))->toBeTrue();
});

test('changing a password requires confirmation', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->put(route('profile.password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'different-password',
        ])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHasErrors('password');
});

test('staff can delete their profile', function () {
    $user = User::factory()->staff()->create(['email' => 'leave@halden.test']);

    $this->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ])
        ->assertRedirect(route('login'));

    $this->assertGuest();
    $this->assertDatabaseMissing('users', [
        'email' => 'leave@halden.test',
    ]);
});

test('deleting a profile rejects the wrong password', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHasErrors([
            'password' => 'The password is incorrect.',
        ]);

    $this->assertAuthenticatedAs($user);
    $this->assertModelExists($user);
});

test('the last admin cannot delete their profile', function () {
    $user = User::factory()->admin()->create(['email' => 'only@halden.test']);

    $this->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ])
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHas('error', 'The last admin account cannot be deleted.');

    $this->assertAuthenticatedAs($user);
    $this->assertModelExists($user);
});

test('an admin can delete their profile when another admin exists', function () {
    $user = User::factory()->admin()->create(['email' => 'leaving@halden.test']);
    User::factory()->admin()->create();

    $this->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ])
        ->assertRedirect(route('login'));

    $this->assertGuest();
    $this->assertDatabaseMissing('users', [
        'email' => 'leaving@halden.test',
    ]);
});
