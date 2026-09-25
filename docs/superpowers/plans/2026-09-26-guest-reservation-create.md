# Guest Reservation Create Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let guests book a free table on `/reserve`, persist a confirmed reservation, email them, and land on a confirmation page.

**Architecture:** Dedicated guest controllers replace the `/reserve` and `POST /reservations` stubs. Availability reuses `EnsuresTableAvailability`. Staff CRUD under `/staff/reservations` is unchanged.

**Tech Stack:** Laravel 13, Inertia React v3, Wayfinder, Pest, Mailables (`log` driver).

## Global Constraints

- Create-only scope (no public list/edit/cancel)
- UUID table ids; 2-hour windows; confirmed blocks, cancelled does not
- Guest FormRequest authorizes publicly (`true`)
- Confirmation copy: **You're booked.** / **This table is yours for two hours.**
- Follow existing Laravel/Inertia conventions; run Pint on dirty PHP; narrow Pest runs

---

## File map

| File | Responsibility |
| --- | --- |
| `app/Http/Controllers/Guest/ReserveController.php` | Live available tables for `/reserve` |
| `app/Http/Controllers/Guest/ReservationController.php` | `store` + `confirmation` |
| `app/Http/Requests/StoreGuestReservationRequest.php` | Public create validation + availability |
| `app/Mail/ReservationConfirmed.php` | Confirmation email |
| `resources/views/mail/reservation-confirmed.blade.php` | Mail body |
| `routes/web.php` | Wire guest routes; remove stubs |
| `resources/js/features/booking/types.ts` | UUID ids |
| `resources/js/features/booking/pages/book.tsx` | Live tables / UUID selection |
| `resources/js/features/booking/components/table-picker.tsx` | Live image_url |
| `resources/js/features/booking/components/reservation-form.tsx` | Redirect-oriented form |
| `resources/js/features/booking/pages/confirmation.tsx` | You're booked page |
| `resources/js/pages/book.tsx` / `confirmation.tsx` | Page entrypoints |
| `tests/Feature/Guest/ReserveAvailabilityTest.php` | Available tables filtering |
| `tests/Feature/Guest/GuestReservationCreateTest.php` | Create, mail, confirmation, failures |

---

### Task 1: Guest FormRequest + mailable

**Files:**
- Create: `app/Http/Requests/StoreGuestReservationRequest.php`
- Create: `app/Mail/ReservationConfirmed.php`
- Create: `resources/views/mail/reservation-confirmed.blade.php`

- [ ] Copy staff store rules without `status`; `authorize(): true`; reuse availability `after` hook from `StoreReservationRequest`
- [ ] Create mailable with reservation (+ table) props; blade lists guest, table, date, time, party, status
- [ ] `vendor/bin/pint --dirty --format agent`
- [ ] Commit: `feat(guest): add public store request and confirmation mailable`

### Task 2: Reserve + store + confirmation controllers and routes

**Files:**
- Create: `app/Http/Controllers/Guest/ReserveController.php`
- Create: `app/Http/Controllers/Guest/ReservationController.php`
- Modify: `routes/web.php`

- [ ] Write failing Pest tests for: available tables filtering; successful create + mail + redirect; overlap failure; cancelled does not block
- [ ] Implement `ReserveController`: query filters; return fitting free tables with `image_url`
- [ ] Implement `ReservationController@store`: validate, create confirmed, send mail, redirect to confirmation
- [ ] Implement `confirmation`: Inertia page with reservation + table
- [ ] Replace closures in `web.php` with controllers; name confirmation `reservations.confirmation`
- [ ] Run `php artisan test --compact tests/Feature/Guest/`
- [ ] Commit: `feat(guest): wire reserve availability and reservation create`

### Task 3: Frontend book + confirmation pages

**Files:**
- Modify booking types, `book.tsx`, `table-picker.tsx`, `reservation-form.tsx`
- Create confirmation feature page + `resources/js/pages/confirmation.tsx`
- Run `php artisan wayfinder:generate --with-form --no-interaction` if route helpers need refresh

- [ ] Switch table/filter ids to `string` UUIDs
- [ ] Drive table cards from live `image_url` / name / capacity
- [ ] Form posts via Wayfinder guest `store`; rely on redirect (no primary inline success)
- [ ] Confirmation page matches guest-frontend copy; link home
- [ ] Smoke: create path still covered by feature tests; regenerate Wayfinder if needed
- [ ] Commit: `feat(guest): connect reserve UI to live booking and confirmation`

### Task 4: Verify

- [ ] `vendor/bin/pint --dirty --format agent`
- [ ] `php artisan test --compact tests/Feature/Guest/ tests/Feature/Staff/ReservationManagementTest.php tests/Feature/Api/ReservationApiTest.php`
- [ ] Ask user to run full suite `php artisan test --compact`
