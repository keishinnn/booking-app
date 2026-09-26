<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('admins can view admin accounts without passwords or staff accounts', function () {
    $admin = User::factory()->admin()->create([
        'name' => 'Visible Admin',
        'email' => 'visible-admin@example.com',
    ]);
    User::factory()->staff()->create(['name' => 'Hidden Staff']);

    $this->actingAs($admin)
        ->get(route('admin.admins.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/admins/index')
            ->has('admins', 1, fn ($member) => $member
                ->where('id', $admin->id)
                ->where('name', 'Visible Admin')
                ->where('email', 'visible-admin@example.com')
                ->where('is_only_admin', true)
                ->missing('password')
            )
        );
});

test('guests are redirected to login when viewing admin management', function () {
    $this->get(route('admin.admins.index'))
        ->assertRedirect(route('login'));
});

test('staff cannot access admin account management', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get(route('admin.admins.index'))
        ->assertForbidden();
});

test('admins can create an admin account', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post(route('admin.admins.store'), [
            'name' => 'New Admin',
            'email' => 'new-admin@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => UserRole::Staff->value,
        ])
        ->assertRedirect(route('admin.admins.index'))
        ->assertSessionHas('success');

    $admin = User::query()->where('email', 'new-admin@example.com')->first();

    expect($admin)->not->toBeNull()
        ->and($admin->name)->toBe('New Admin')
        ->and($admin->role)->toBe(UserRole::Admin)
        ->and(Hash::check('password', $admin->password))->toBeTrue();
});

test('creating an admin account requires a password', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post(route('admin.admins.store'), [
            'name' => 'New Admin',
            'email' => 'new-admin@example.com',
        ])
        ->assertSessionHasErrors('password');

    $this->assertDatabaseMissing('users', [
        'email' => 'new-admin@example.com',
    ]);
});

test('creating an admin account rejects a duplicate email', function () {
    $user = User::factory()->admin()->create();
    User::factory()->staff()->create(['email' => 'taken@example.com']);

    $this->actingAs($user)
        ->post(route('admin.admins.store'), [
            'name' => 'Other Admin',
            'email' => 'taken@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertSessionHasErrors('email');
});

test('admins can update an admin account without changing the password', function () {
    $user = User::factory()->admin()->create();
    $admin = User::factory()->admin()->create([
        'name' => 'Old Admin',
        'email' => 'old-admin@example.com',
    ]);
    $originalPassword = $admin->password;

    $this->actingAs($user)
        ->put(route('admin.admins.update', $admin), [
            'name' => 'New Admin',
            'email' => 'new-admin@example.com',
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertRedirect(route('admin.admins.index'))
        ->assertSessionHas('success');

    $admin->refresh();

    expect($admin->name)->toBe('New Admin')
        ->and($admin->email)->toBe('new-admin@example.com')
        ->and($admin->role)->toBe(UserRole::Admin)
        ->and($admin->password)->toBe($originalPassword);
});

test('admins can set a new admin password', function () {
    $user = User::factory()->admin()->create();
    $admin = User::factory()->admin()->create();

    $this->actingAs($user)
        ->put(route('admin.admins.update', $admin), [
            'name' => $admin->name,
            'email' => $admin->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect(route('admin.admins.index'));

    expect(Hash::check('new-password', $admin->refresh()->password))->toBeTrue();
});

test('admins can delete another admin account', function () {
    $user = User::factory()->admin()->create();
    $admin = User::factory()->admin()->create(['email' => 'remove-admin@example.com']);

    $this->actingAs($user)
        ->delete(route('admin.admins.destroy', $admin))
        ->assertRedirect(route('admin.admins.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('users', [
        'email' => 'remove-admin@example.com',
    ]);
    $this->assertAuthenticatedAs($user);
});

test('the last admin account cannot be deleted', function () {
    $user = User::factory()->admin()->create(['email' => 'only-admin@example.com']);

    $this->actingAs($user)
        ->delete(route('admin.admins.destroy', $user))
        ->assertRedirect(route('admin.admins.index'))
        ->assertSessionHas('error', 'The last admin account cannot be deleted.');

    $this->assertAuthenticatedAs($user);
    $this->assertModelExists($user);
});

test('an admin who deletes their own account is signed out', function () {
    $user = User::factory()->admin()->create(['email' => 'self-delete@example.com']);
    User::factory()->admin()->create();

    $this->actingAs($user)
        ->delete(route('admin.admins.destroy', $user))
        ->assertRedirect(route('login'));

    $this->assertGuest();
    $this->assertDatabaseMissing('users', [
        'email' => 'self-delete@example.com',
    ]);
});

test('updating a staff account through admin management returns 404', function () {
    $user = User::factory()->admin()->create();
    $staff = User::factory()->staff()->create([
        'name' => 'Floor Person',
        'email' => 'floor@example.com',
    ]);

    $this->actingAs($user)
        ->put(route('admin.admins.update', $staff), [
            'name' => 'Changed Floor',
            'email' => 'changed-floor@example.com',
        ])
        ->assertNotFound();

    $this->assertDatabaseHas('users', [
        'id' => $staff->id,
        'name' => 'Floor Person',
        'email' => 'floor@example.com',
    ]);
});

test('deleting a staff account through admin management returns 404', function () {
    $user = User::factory()->admin()->create();
    $staff = User::factory()->staff()->create(['email' => 'keep-staff@example.com']);

    $this->actingAs($user)
        ->delete(route('admin.admins.destroy', $staff))
        ->assertNotFound();

    $this->assertDatabaseHas('users', [
        'email' => 'keep-staff@example.com',
    ]);
});
