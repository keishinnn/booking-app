# Reservation Service Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Staff can Seat, Complete, No-show, and Walk-in reservations; the floor uses hybrid occupancy (clock + status overrides); Complete/No-show free the table immediately.

**Architecture:** Expand `ReservationStatus` with `seated` / `completed` / `no_show`. Dedicated staff action endpoints call a small transition service. `EnsuresTableAvailability` blocks only `confirmed` and `seated`. Floor cards treat `seated` as In service and ignore terminal statuses. Walk-in creates a `seated` booking for today at the current valid hour.

**Tech Stack:** Laravel 13, Pest, Inertia React v3, Wayfinder, existing staff floor/ledger UI.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-26-reservation-service-lifecycle-design.md`
- Statuses: `confirmed` | `seated` | `completed` | `no_show` | `cancelled`
- Availability blockers: `confirmed`, `seated` only
- Seat is idempotent when already `seated`
- No-show only from `confirmed`; Complete only from `seated`
- Walk-in: `status=seated`, `reserved_on=today`, `starts_at` = current clock hour if in `EnsuresTableAvailability::START_TIMES`
- Out of scope: reassign, undo, race locks, capacity-shrink, guest self-cancel
- Follow existing conventions; `vendor/bin/pint --dirty --format agent` after PHP changes; narrow Pest runs; Wayfinder via `@/routes/staff/...`

---

## File map

| File | Responsibility |
| --- | --- |
| `app/Enums/ReservationStatus.php` | Expanded cases + helper for blocking statuses |
| `app/Services/TransitionsReservationStatus.php` | Seat / Complete / No-show with validation |
| `app/Services/EnsuresTableAvailability.php` | Block `confirmed` + `seated` |
| `app/Http/Controllers/Staff/ReservationController.php` | `seat`, `complete`, `noShow`, `walkIn` actions |
| `app/Http/Requests/StoreWalkInReservationRequest.php` | Walk-in validation |
| `app/Http/Requests/UpdateReservationRequest.php` | Restrict free-form `status` to confirmed\|cancelled |
| `routes/web.php` | Wire action routes |
| `database/factories/ReservationFactory.php` | `seated` / `completed` / `noShow` states |
| `app/Http/Controllers/Staff/DashboardController.php` | Include `confirmed` + `seated` in floor props |
| `app/Http/Controllers/Staff/TableController.php` | Same status filter |
| `resources/js/features/staff/types.ts` | Extended status union |
| `resources/js/features/staff/components/reservation-badges.tsx` | Badges for new statuses |
| `resources/js/features/staff/lib/build-floor-table-cards.ts` | Hybrid In service / Reserved / Open |
| `resources/js/features/staff/components/reservation-row-actions.tsx` | Seat / Complete / No-show menu items |
| `resources/js/features/staff/components/table-schedule-modal.tsx` | Floor row actions + walk-in CTA |
| `resources/js/features/staff/pages/reservations.tsx` | Wire ledger actions |
| `tests/Feature/Staff/ReservationLifecycleTest.php` | Transitions, auth, availability side-effects |
| `tests/Feature/Staff/WalkInReservationTest.php` | Walk-in happy/fail paths |
| `tests/Feature/Staff/DashboardFloorTest.php` / `TablePageTest.php` | Seated included; completed excluded from blockers |

---

### Task 1: Status enum, factory states, availability blockers

**Files:**
- Modify: `app/Enums/ReservationStatus.php`
- Modify: `app/Services/EnsuresTableAvailability.php`
- Modify: `database/factories/ReservationFactory.php`
- Test: `tests/Feature/Staff/ReservationLifecycleTest.php` (availability section first)

**Interfaces:**
- Produces: `ReservationStatus::blocking(): array` returning `[Confirmed, Seated]`
- Produces: factory states `seated()`, `completed()`, `noShow()`

- [ ] **Step 1: Write failing availability tests**

Create `tests/Feature/Staff/ReservationLifecycleTest.php`:

```php
<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;
use App\Services\EnsuresTableAvailability;

test('seated reservations block overlapping availability', function () {
    $table = Table::factory()->create(['capacity' => 4]);
    Reservation::factory()->seated()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    expect(app(EnsuresTableAvailability::class)->isAvailable(
        tableId: $table->id,
        reservedOn: '2026-10-01',
        startsAt: '19:00',
        partySize: 2,
    ))->toBeFalse();
});

test('completed and no_show reservations do not block availability', function () {
    $table = Table::factory()->create(['capacity' => 4]);

    Reservation::factory()->completed()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    Reservation::factory()->noShow()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-02',
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    expect(app(EnsuresTableAvailability::class)->isAvailable(
        tableId: $table->id,
        reservedOn: '2026-10-01',
        startsAt: '18:00',
        partySize: 2,
    ))->toBeTrue();

    expect(app(EnsuresTableAvailability::class)->isAvailable(
        tableId: $table->id,
        reservedOn: '2026-10-02',
        startsAt: '18:00',
        partySize: 2,
    ))->toBeTrue();
});
```

- [ ] **Step 2: Run tests — expect FAIL** (missing factory states / still only Confirmed blocks)

```bash
php artisan test --compact tests/Feature/Staff/ReservationLifecycleTest.php
```

- [ ] **Step 3: Expand enum + factory + availability query**

`ReservationStatus`:

```php
enum ReservationStatus: string
{
    case Confirmed = 'confirmed';
    case Seated = 'seated';
    case Completed = 'completed';
    case NoShow = 'no_show';
    case Cancelled = 'cancelled';

    /**
     * @return list<self>
     */
    public static function blocking(): array
    {
        return [self::Confirmed, self::Seated];
    }
}
```

In `EnsuresTableAvailability::ensure`, replace:

```php
->where('status', ReservationStatus::Confirmed)
```

with:

```php
->whereIn('status', ReservationStatus::blocking())
```

Factory states:

```php
public function seated(): static
{
    return $this->state(fn () => ['status' => ReservationStatus::Seated]);
}

public function completed(): static
{
    return $this->state(fn () => ['status' => ReservationStatus::Completed]);
}

public function noShow(): static
{
    return $this->state(fn () => ['status' => ReservationStatus::NoShow]);
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
php artisan test --compact tests/Feature/Staff/ReservationLifecycleTest.php
```

- [ ] **Step 5: Pint + commit**

```bash
vendor/bin/pint --dirty --format agent
git add app/Enums/ReservationStatus.php app/Services/EnsuresTableAvailability.php database/factories/ReservationFactory.php tests/Feature/Staff/ReservationLifecycleTest.php
git commit -m "feat(reservations): block availability for seated status"
```

---

### Task 2: Transition service + seat / complete / no-show endpoints

**Files:**
- Create: `app/Services/TransitionsReservationStatus.php`
- Modify: `app/Http/Controllers/Staff/ReservationController.php`
- Modify: `app/Http/Requests/UpdateReservationRequest.php` (status `Rule::in` confirmed|cancelled only)
- Modify: `routes/web.php`
- Test: `tests/Feature/Staff/ReservationLifecycleTest.php`

**Interfaces:**
- Consumes: `ReservationStatus` cases from Task 1
- Produces:
  - `TransitionsReservationStatus::seat(Reservation $reservation): void`
  - `TransitionsReservationStatus::complete(Reservation $reservation): void`
  - `TransitionsReservationStatus::noShow(Reservation $reservation): void`
  - Routes: `staff.reservations.seat`, `.complete`, `.no-show`

- [ ] **Step 1: Append failing HTTP transition tests** to `ReservationLifecycleTest.php`

```php
test('staff can seat a confirmed reservation and seating is idempotent', function () {
    $user = User::factory()->staff()->create();
    $reservation = Reservation::factory()->create(['status' => ReservationStatus::Confirmed]);

    $this->actingAs($user)
        ->post(route('staff.reservations.seat', $reservation))
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe(ReservationStatus::Seated);

    $this->actingAs($user)
        ->post(route('staff.reservations.seat', $reservation))
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe(ReservationStatus::Seated);
});

test('staff can complete a seated reservation', function () {
    $user = User::factory()->staff()->create();
    $reservation = Reservation::factory()->seated()->create();

    $this->actingAs($user)
        ->post(route('staff.reservations.complete', $reservation))
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe(ReservationStatus::Completed);
});

test('staff can mark a confirmed reservation as no-show', function () {
    $user = User::factory()->staff()->create();
    $reservation = Reservation::factory()->create();

    $this->actingAs($user)
        ->post(route('staff.reservations.no-show', $reservation))
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe(ReservationStatus::NoShow);
});

test('invalid lifecycle transitions return validation errors', function () {
    $user = User::factory()->staff()->create();
    $completed = Reservation::factory()->completed()->create();
    $seated = Reservation::factory()->seated()->create();

    $this->actingAs($user)
        ->post(route('staff.reservations.complete', $completed))
        ->assertSessionHasErrors();

    $this->actingAs($user)
        ->post(route('staff.reservations.no-show', $seated))
        ->assertSessionHasErrors();
});

test('guests cannot call lifecycle actions', function () {
    $reservation = Reservation::factory()->create();

    $this->post(route('staff.reservations.seat', $reservation))
        ->assertRedirect(route('login'));
});
```

- [ ] **Step 2: Run tests — expect FAIL** (missing routes/methods)

```bash
php artisan test --compact tests/Feature/Staff/ReservationLifecycleTest.php
```

- [ ] **Step 3: Implement transition service**

```php
<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use Illuminate\Validation\ValidationException;

class TransitionsReservationStatus
{
    public function seat(Reservation $reservation): void
    {
        if ($reservation->status === ReservationStatus::Seated) {
            return;
        }

        if ($reservation->status !== ReservationStatus::Confirmed) {
            throw ValidationException::withMessages([
                'status' => 'Only confirmed reservations can be seated.',
            ]);
        }

        $reservation->update(['status' => ReservationStatus::Seated]);
    }

    public function complete(Reservation $reservation): void
    {
        if ($reservation->status !== ReservationStatus::Seated) {
            throw ValidationException::withMessages([
                'status' => 'Only seated reservations can be completed.',
            ]);
        }

        $reservation->update(['status' => ReservationStatus::Completed]);
    }

    public function noShow(Reservation $reservation): void
    {
        if ($reservation->status !== ReservationStatus::Confirmed) {
            throw ValidationException::withMessages([
                'status' => 'Only confirmed reservations can be marked no-show.',
            ]);
        }

        $reservation->update(['status' => ReservationStatus::NoShow]);
    }
}
```

- [ ] **Step 4: Wire controller methods + routes**

In `Staff\ReservationController`, inject or resolve the service:

```php
public function seat(Reservation $reservation, TransitionsReservationStatus $transitions): RedirectResponse
{
    $this->authorize('update', $reservation);
    $transitions->seat($reservation);

    return back()->with('success', 'Guest seated.');
}

public function complete(Reservation $reservation, TransitionsReservationStatus $transitions): RedirectResponse
{
    $this->authorize('update', $reservation);
    $transitions->complete($reservation);

    return back()->with('success', 'Reservation completed.');
}

public function noShow(Reservation $reservation, TransitionsReservationStatus $transitions): RedirectResponse
{
    $this->authorize('update', $reservation);
    $transitions->noShow($reservation);

    return back()->with('success', 'Marked as no-show.');
}
```

In `routes/web.php` inside the staff group (before `{reservation}` update/destroy is fine; use explicit paths):

```php
Route::post('/reservations/walk-in', [StaffReservationController::class, 'walkIn'])->name('reservations.walk-in');
Route::post('/reservations/{reservation}/seat', [StaffReservationController::class, 'seat'])->name('reservations.seat');
Route::post('/reservations/{reservation}/complete', [StaffReservationController::class, 'complete'])->name('reservations.complete');
Route::post('/reservations/{reservation}/no-show', [StaffReservationController::class, 'noShow'])->name('reservations.no-show');
```

Add seat/complete/no-show routes now. Add the walk-in route in Task 3 (register it before `{reservation}` routes so `walk-in` is not captured as an id).

Restrict `UpdateReservationRequest` status rule:

```php
'status' => ['sometimes', Rule::in([
    ReservationStatus::Confirmed->value,
    ReservationStatus::Cancelled->value,
])],
```

Also treat cancelled-or-terminal skip: keep skipping availability only when status is cancelled (unchanged).

- [ ] **Step 5: Run tests — expect PASS**

```bash
php artisan test --compact tests/Feature/Staff/ReservationLifecycleTest.php
```

- [ ] **Step 6: Pint + commit**

```bash
vendor/bin/pint --dirty --format agent
git add app/Services/TransitionsReservationStatus.php app/Http/Controllers/Staff/ReservationController.php app/Http/Requests/UpdateReservationRequest.php routes/web.php tests/Feature/Staff/ReservationLifecycleTest.php
git commit -m "feat(staff): add seat, complete, and no-show reservation actions"
```

---

### Task 3: Walk-in endpoint

**Files:**
- Create: `app/Http/Requests/StoreWalkInReservationRequest.php`
- Modify: `app/Http/Controllers/Staff/ReservationController.php` (`walkIn`)
- Modify: `routes/web.php`
- Test: `tests/Feature/Staff/WalkInReservationTest.php`

**Interfaces:**
- Consumes: `EnsuresTableAvailability`, `ReservationStatus::Seated`
- Produces: `staff.reservations.walk-in` → creates seated reservation

- [ ] **Step 1: Write failing walk-in tests**

```php
<?php

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Table;
use App\Models\User;
use App\Services\EnsuresTableAvailability;
use Illuminate\Support\Carbon;

test('staff can create a walk-in as seated for the current hour', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 18:20:00'));
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);

    $this->actingAs($user)
        ->post(route('staff.reservations.walk-in'), [
            'table_id' => $table->id,
            'guest_name' => 'Walk In Guest',
            'email' => 'walkin@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 2,
            'notes' => null,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $reservation = Reservation::query()->where('guest_name', 'Walk In Guest')->first();
    expect($reservation)->not->toBeNull()
        ->and($reservation->status)->toBe(ReservationStatus::Seated)
        ->and($reservation->table_id)->toBe($table->id)
        ->and($reservation->reserved_on->format('Y-m-d'))->toBe('2026-10-01')
        ->and(app(EnsuresTableAvailability::class)->normalizeTime((string) $reservation->starts_at))->toBe('18:00');
});

test('walk-in outside service hours is rejected', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 09:15:00'));
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);

    $this->actingAs($user)
        ->post(route('staff.reservations.walk-in'), [
            'table_id' => $table->id,
            'guest_name' => 'Too Early',
            'email' => 'early@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 2,
        ])
        ->assertSessionHasErrors('starts_at');
});

test('walk-in overlapping a seated booking is rejected', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 18:20:00'));
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 4]);
    Reservation::factory()->seated()->create([
        'table_id' => $table->id,
        'reserved_on' => '2026-10-01',
        'starts_at' => '18:00',
        'party_size' => 2,
    ]);

    $this->actingAs($user)
        ->post(route('staff.reservations.walk-in'), [
            'table_id' => $table->id,
            'guest_name' => 'Overlap',
            'email' => 'overlap@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 2,
        ])
        ->assertSessionHasErrors();
});

test('walk-in over capacity is rejected', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-01 18:20:00'));
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create(['capacity' => 2]);

    $this->actingAs($user)
        ->post(route('staff.reservations.walk-in'), [
            'table_id' => $table->id,
            'guest_name' => 'Too Many',
            'email' => 'big@example.com',
            'phone' => '+46 70 111 2222',
            'party_size' => 4,
        ])
        ->assertSessionHasErrors('party_size');
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
php artisan test --compact tests/Feature/Staff/WalkInReservationTest.php
```

- [ ] **Step 3: Implement FormRequest + controller + route**

`StoreWalkInReservationRequest`:

- `authorize`: `can('create', Reservation::class)`
- `prepareForValidation`: set `reserved_on` to `now()->toDateString()`, set `starts_at` to `now()->format('H:00')` normalized, empty notes → null
- `rules`: same guest fields as store; `table_id` required; no client `status` / `reserved_on` / free `starts_at` (server-set); `starts_at` must be `Rule::in(START_TIMES)` after merge
- `after` hook: call `EnsuresTableAvailability::ensure(...)`

Controller:

```php
public function walkIn(StoreWalkInReservationRequest $request): RedirectResponse
{
    $data = $request->validated();
    $data['status'] = ReservationStatus::Seated->value;

    Reservation::query()->create($data);

    return back()->with('success', 'Walk-in seated.');
}
```

Route (register **before** `{reservation}` parameterized routes):

```php
Route::post('/reservations/walk-in', [StaffReservationController::class, 'walkIn'])->name('reservations.walk-in');
```

- [ ] **Step 4: Run — expect PASS**

```bash
php artisan test --compact tests/Feature/Staff/WalkInReservationTest.php
```

- [ ] **Step 5: Pint + commit**

```bash
vendor/bin/pint --dirty --format agent
git add app/Http/Requests/StoreWalkInReservationRequest.php app/Http/Controllers/Staff/ReservationController.php routes/web.php tests/Feature/Staff/WalkInReservationTest.php
git commit -m "feat(staff): add walk-in seating for open tables"
```

---

### Task 4: Floor/dashboard props include seated; floor card hybrid logic

**Files:**
- Modify: `app/Http/Controllers/Staff/DashboardController.php`
- Modify: `app/Http/Controllers/Staff/TableController.php`
- Modify: `resources/js/features/staff/lib/build-floor-table-cards.ts`
- Modify: `resources/js/features/staff/types.ts`
- Modify: `tests/Feature/Staff/DashboardFloorTest.php`
- Modify: `tests/Feature/Staff/TablePageTest.php`
- Optional unit-style Vitest is **not** in project — cover hybrid via PHP feature props + keep TS logic simple; if no JS test runner for this file, assert behavior by reading props that include seated and relying on manual/logic review. Prefer adding a tiny Node-free check: document expected conditions in comments matching the spec table.

**Interfaces:**
- Consumes: `ReservationStatus::blocking()` for query `whereIn`
- Produces: floor props with `confirmed` + `seated` only; client In service if `status === 'seated'` OR (confirmed && window active)

- [ ] **Step 1: Extend DashboardFloorTest / TablePageTest**

```php
test('dashboard floor props include seated but not completed reservations', function () {
    $user = User::factory()->staff()->create();
    $table = Table::factory()->create();
    $today = now()->toDateString();

    Reservation::factory()->seated()->create([
        'table_id' => $table->id,
        'guest_name' => 'Seated Now',
        'reserved_on' => $today,
        'starts_at' => '12:00',
    ]);

    Reservation::factory()->completed()->create([
        'table_id' => $table->id,
        'guest_name' => 'Done Guest',
        'reserved_on' => $today,
        'starts_at' => '18:00',
    ]);

    $this->actingAs($user)
        ->get(route('staff.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('reservations', 1)
            ->where('reservations.0.guest_name', 'Seated Now')
            ->where('reservations.0.status', 'seated')
        );
});
```

Mirror for `staff.tables` in `TablePageTest.php`.

- [ ] **Step 2: Run — expect FAIL** (still filters Confirmed only)

```bash
php artisan test --compact tests/Feature/Staff/DashboardFloorTest.php tests/Feature/Staff/TablePageTest.php
```

- [ ] **Step 3: Update controllers**

```php
->whereIn('status', ReservationStatus::blocking())
```

(replace `->where('status', ReservationStatus::Confirmed)`).

- [ ] **Step 4: Update TypeScript types + `buildFloorTableCards`**

`types.ts`:

```ts
export type ReservationStatus =
    | 'confirmed'
    | 'seated'
    | 'completed'
    | 'no_show'
    | 'cancelled';
```

In `buildFloorTableCards`, only consider reservations with `status === 'confirmed' || status === 'seated'` (defensive). Then:

```ts
const inService = tableReservations.find(
    (reservation) =>
        reservation.status === 'seated' ||
        (reservation.status === 'confirmed' &&
            isWindowActive(reservation.starts_at, now, today)),
);

const next = tableReservations.find(
    (reservation) =>
        reservation.status === 'confirmed' &&
        isUpcoming(reservation.starts_at, now, today),
);
```

Priority: any `seated` for the table wins In service even outside the clock window (early seat / late finish still seated until Complete).

- [ ] **Step 5: Run PHP tests — expect PASS**

```bash
php artisan test --compact tests/Feature/Staff/DashboardFloorTest.php tests/Feature/Staff/TablePageTest.php
```

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/Staff/DashboardController.php app/Http/Controllers/Staff/TableController.php resources/js/features/staff/types.ts resources/js/features/staff/lib/build-floor-table-cards.ts tests/Feature/Staff/DashboardFloorTest.php tests/Feature/Staff/TablePageTest.php
git commit -m "feat(staff): hybrid floor occupancy for seated reservations"
```

---

### Task 5: Badges + ledger + floor UI actions

**Files:**
- Modify: `resources/js/features/staff/components/reservation-badges.tsx`
- Modify: `resources/js/features/staff/components/reservation-row-actions.tsx`
- Modify: `resources/js/features/staff/pages/reservations.tsx`
- Modify: `resources/js/features/staff/components/reservation-list.tsx` (if it duplicates actions)
- Modify: `resources/js/features/staff/components/table-schedule-modal.tsx`
- Modify: `resources/js/features/staff/pages/dashboard.tsx` / `tables.tsx` as needed to pass action handlers / walk-in form state
- Run: `php artisan wayfinder:generate --with-form --no-interaction`

**Interfaces:**
- Consumes: Wayfinder routes `seat`, `complete`, `noShow`, `walkIn` from `@/routes/staff/reservations`
- Produces: UI that posts those routes with Inertia `router.post`

- [ ] **Step 1: Regenerate Wayfinder**

```bash
php artisan wayfinder:generate --with-form --no-interaction
```

Confirm generated helpers exist under `resources/js/routes/staff/reservations/`.

- [ ] **Step 2: Extend badges**

```ts
const statusTone: Record<ReservationStatus, string> = {
    confirmed: 'bg-[#1a7a4c] text-white',
    seated: 'bg-[#1d4ed8] text-white',
    completed: 'bg-[#57534e] text-white',
    no_show: 'bg-[#a16207] text-white',
    cancelled: 'bg-[#9f1239] text-white',
};

const statusLabel: Record<ReservationStatus, string> = {
    confirmed: 'Confirmed',
    seated: 'Seated',
    completed: 'Completed',
    no_show: 'No-show',
    cancelled: 'Cancelled',
};
```

- [ ] **Step 3: Extend row actions**

Menu items (in addition to Edit / Cancel):

- `confirmed` → Seat, No-show
- `seated` → Complete
- Keep Cancel for `confirmed` and `seated` (matches destroy soft-cancel)

Wire with:

```ts
router.post(seat.url(reservation.id));
router.post(complete.url(reservation.id));
router.post(noShow.url(reservation.id));
```

Import names come from Wayfinder (`seat`, `complete`, `noShow`). Follow existing cancel pattern in `reservations.tsx` for flash/redirect.

- [ ] **Step 4: Floor modal actions + walk-in**

In `table-schedule-modal.tsx`:

- For each row, show the same status-gated buttons (compact).
- When the selected table has **no** confirmed/seated rows for **today** (Open), show a Walk-in button that opens a small form (guest_name, email, phone, party_size, notes) posting to `walkIn` with `table_id`.

Reuse existing form field styles from `reservation-form.tsx` where practical; keep the walk-in form minimal.

- [ ] **Step 5: Smoke via feature tests already written** (no browser suite). Manually verify TypeScript compiles if the project has a typecheck script; otherwise rely on Vite build when user runs `npm run dev`.

- [ ] **Step 6: Commit**

```bash
git add resources/js/features/staff resources/js/routes resources/js/actions
git commit -m "feat(staff): wire seat, complete, no-show, and walk-in UI"
```

---

### Task 6: Verify

- [ ] **Step 1: Pint**

```bash
vendor/bin/pint --dirty --format agent
```

- [ ] **Step 2: Run focused suite**

```bash
php artisan test --compact \
  tests/Feature/Staff/ReservationLifecycleTest.php \
  tests/Feature/Staff/WalkInReservationTest.php \
  tests/Feature/Staff/ReservationManagementTest.php \
  tests/Feature/Staff/DashboardFloorTest.php \
  tests/Feature/Staff/TablePageTest.php \
  tests/Feature/Guest/ \
  tests/Feature/Api/ReservationApiTest.php
```

Expected: all PASS. Fix any guest/API tests that assume only two statuses in resources if they break.

- [ ] **Step 3: Ask user to run full suite**

```bash
php artisan test --compact
```

---

## Spec coverage checklist

| Spec item | Task |
| --- | --- |
| Expanded statuses | 1 |
| Availability blockers confirmed+seated | 1 |
| Seat / Complete / No-show + idempotent Seat | 2 |
| Invalid transitions 422 | 2 |
| Update status limited to confirmed\|cancelled | 2 |
| Walk-in seated today current hour | 3 |
| Walk-in capacity/overlap/hours errors | 3 |
| Floor props + hybrid derivation | 4 |
| Ledger + floor UI + walk-in CTA | 5 |
| Auth staff-only | 2, 3 |
| Out of scope items not implemented | — |
