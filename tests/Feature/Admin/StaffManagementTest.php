<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('admins can view floor staff without passwords or admin accounts', function () {
    $admin = User::factory()->admin()->create(['name' => 'Hidden Admin']);
    $staff = User::factory()->staff()->create([
        'name' => 'Visible Staff',
        'email' => 'visible@example.com',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.staff.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/staff/index')
            ->has('staff', 1, fn ($member) => $member
                ->where('id', $staff->id)
                ->where('name', 'Visible Staff')
                ->where('email', 'visible@example.com')
                ->missing('password')
            )
        );
});

test('guests are redirected to login when viewing staff management', function () {
    $this->get(route('admin.staff.index'))
        ->assertRedirect(route('login'));
});

test('staff cannot access admin staff management', function () {
    $user = User::factory()->staff()->create();

    $this->actingAs($user)
        ->get(route('admin.staff.index'))
        ->assertForbidden();
});

test('admins can create a staff account', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post(route('admin.staff.store'), [
            'name' => 'New Floor',
            'email' => 'new-floor@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => UserRole::Admin->value,
        ])
        ->assertRedirect(route('admin.staff.index'))
        ->assertSessionHas('success');

    $staff = User::query()->where('email', 'new-floor@example.com')->firstOrFail();

    expect($staff->name)->toBe('New Floor')
        ->and($staff->role)->toBe(UserRole::Staff)
        ->and(Hash::check('password', $staff->password))->toBeTrue();
});

test('creating a staff account requires a password', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post(route('admin.staff.store'), [
            'name' => 'New Floor',
            'email' => 'new-floor@example.com',
        ])
        ->assertSessionHasErrors([
            'password' => 'The password field is required.',
        ]);

    $this->assertDatabaseMissing('users', [
        'email' => 'new-floor@example.com',
    ]);
});

test('creating a staff account rejects a duplicate email', function () {
    $user = User::factory()->admin()->create();
    User::factory()->staff()->create(['email' => 'taken@example.com']);

    $this->actingAs($user)
        ->post(route('admin.staff.store'), [
            'name' => 'Other Floor',
            'email' => 'taken@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertSessionHasErrors([
            'email' => 'The email has already been taken.',
        ]);
});

test('admins can update a staff account without changing the password', function () {
    $user = User::factory()->admin()->create();
    $staff = User::factory()->staff()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);
    $originalPassword = $staff->password;

    $this->actingAs($user)
        ->put(route('admin.staff.update', $staff), [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertRedirect(route('admin.staff.index'))
        ->assertSessionHas('success');

    $staff->refresh();

    expect($staff->name)->toBe('New Name')
        ->and($staff->email)->toBe('new@example.com')
        ->and($staff->password)->toBe($originalPassword);
});

test('admins can set a new staff password', function () {
    $user = User::factory()->admin()->create();
    $staff = User::factory()->staff()->create();

    $this->actingAs($user)
        ->put(route('admin.staff.update', $staff), [
            'name' => $staff->name,
            'email' => $staff->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect(route('admin.staff.index'));

    expect(Hash::check('new-password', $staff->refresh()->password))->toBeTrue();
});

test('admins can delete a staff account', function () {
    $user = User::factory()->admin()->create();
    $staff = User::factory()->staff()->create(['email' => 'remove@example.com']);

    $this->actingAs($user)
        ->delete(route('admin.staff.destroy', $staff))
        ->assertRedirect(route('admin.staff.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('users', [
        'email' => 'remove@example.com',
    ]);
});

test('updating an admin account through staff management returns 404', function () {
    $user = User::factory()->admin()->create();
    $otherAdmin = User::factory()->admin()->create([
        'name' => 'Other Admin',
        'email' => 'other-admin@example.com',
    ]);

    $this->actingAs($user)
        ->put(route('admin.staff.update', $otherAdmin), [
            'name' => 'Changed Admin',
            'email' => 'changed-admin@example.com',
        ])
        ->assertNotFound();

    $this->assertDatabaseHas('users', [
        'id' => $otherAdmin->id,
        'name' => 'Other Admin',
        'email' => 'other-admin@example.com',
    ]);
});

test('deleting an admin account through staff management returns 404', function () {
    $user = User::factory()->admin()->create();
    $otherAdmin = User::factory()->admin()->create(['email' => 'keep-admin@example.com']);

    $this->actingAs($user)
        ->delete(route('admin.staff.destroy', $otherAdmin))
        ->assertNotFound();

    $this->assertDatabaseHas('users', [
        'email' => 'keep-admin@example.com',
    ]);
});
