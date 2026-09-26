# Gmail SMTP + Branded Confirmation Mail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the create-time `ReservationConfirmed` email to Halden branding and document Gmail SMTP `.env` so a demo can deliver real inbox mail.

**Architecture:** Keep the existing send path in `Guest\ReservationController@store`. Update the mailable subject and Markdown body to match `docs/BRAND.md`, publish Laravel mail views, and add a `halden` CSS theme (cream / bar / ink). SMTP is config-only via `.env`; local default stays `log`.

**Tech Stack:** Laravel mailables (Markdown + published HTML theme), Pest, Gmail SMTP App Password (env only).

## Global Constraints

- Create confirmation only — no cancel or update mail
- Copy and colors from `docs/BRAND.md` Email + Color sections (verbatim tokens)
- Subject: `Your table at Halden`; from name: `Halden`
- No live SMTP in CI; tests use `Mail::fake()`
- Secrets never committed; `.env.example` may show placeholder Gmail keys only
- Run `vendor/bin/pint --dirty --format agent` on dirty PHP before commit
- Narrow Pest: `php artisan test --compact tests/Feature/Guest/GuestReservationCreateTest.php`

---

## File map

| File | Responsibility |
| --- | --- |
| `app/Mail/ReservationConfirmed.php` | Subject + `halden` theme |
| `resources/views/mail/reservation-confirmed.blade.php` | Brand body copy |
| `resources/views/vendor/mail/html/themes/halden.css` | Cream / bar / ink mail theme |
| `resources/views/vendor/mail/html/header.blade.php` | Bar header + cream wordmark |
| `tests/Feature/Guest/GuestReservationCreateTest.php` | Subject + rendered HTML copy assertions |
| `.env.example` | Document Gmail SMTP vars; default still `log` |

No controller or route changes.

---

### Task 1: Failing tests for subject and brand copy

**Files:**
- Modify: `tests/Feature/Guest/GuestReservationCreateTest.php`
- Test: same file

**Interfaces:**
- Consumes: `App\Mail\ReservationConfirmed`, existing create route
- Produces: assertions for subject `Your table at Halden` and brand body phrases

- [ ] **Step 1: Extend the successful-create mail assertion**

In `tests/Feature/Guest/GuestReservationCreateTest.php`, replace the `Mail::assertSent` closure in `guest can create a reservation and is redirected to confirmation with mail sent` with:

```php
Mail::assertSent(ReservationConfirmed::class, function (ReservationConfirmed $mail) use ($reservation, $table) {
    $mail->assertHasSubject('Your table at Halden');
    $mail->assertSeeInText('Astrid Lind, your table is booked.');
    $mail->assertSeeInText($table->name);
    $mail->assertSeeInText('party of 2');
    $mail->assertSeeInText('We will hold it for two hours.');
    $mail->assertDontSeeInText('Status:');

    return $mail->reservation->is($reservation)
        && $mail->hasTo('astrid@example.com');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
php artisan test --compact tests/Feature/Guest/GuestReservationCreateTest.php --filter="guest can create a reservation"
```

Expected: FAIL on subject (current subject is `Your table at Halden is booked`) and/or missing brand phrases.

- [ ] **Step 3: Commit the failing test expectation**

```bash
git add tests/Feature/Guest/GuestReservationCreateTest.php
git commit -m "$(cat <<'EOF'
test(mail): expect branded confirmation subject and copy

EOF
)"
```

---

### Task 2: Mailable subject + brand body

**Files:**
- Modify: `app/Mail/ReservationConfirmed.php`
- Modify: `resources/views/mail/reservation-confirmed.blade.php`

**Interfaces:**
- Consumes: `Reservation` with `table`, `guest_name`, `reserved_on`, `starts_at`, `party_size`
- Produces: envelope subject `Your table at Halden`; Markdown body per BRAND.md

- [ ] **Step 1: Update subject**

In `app/Mail/ReservationConfirmed.php`, set envelope subject to:

```php
return new Envelope(
    subject: 'Your table at Halden',
);
```

- [ ] **Step 2: Rewrite the Markdown body**

Replace `resources/views/mail/reservation-confirmed.blade.php` with:

```blade
<x-mail::message>
{{ $reservation->guest_name }}, your table is booked.

{{ $reservation->table?->name }} · {{ $reservation->reserved_on->format('l, j F Y') }} · {{ \Illuminate\Support\Str::of((string) $reservation->starts_at)->substr(0, 5) }} · party of {{ $reservation->party_size }}

We will hold it for two hours.

Halden
</x-mail::message>
```

Do **not** append a “Thanks,” block — the trailing `Halden` is the only close.

- [ ] **Step 3: Run the filtered test**

```bash
php artisan test --compact tests/Feature/Guest/GuestReservationCreateTest.php --filter="guest can create a reservation"
```

Expected: PASS on subject/copy (theme colors still default until Task 3).

- [ ] **Step 4: Commit**

```bash
git add app/Mail/ReservationConfirmed.php resources/views/mail/reservation-confirmed.blade.php
git commit -m "$(cat <<'EOF'
feat(mail): align confirmation subject and body with brand

EOF
)"
```

---

### Task 3: Publish Halden mail theme

**Files:**
- Create via publish: `resources/views/vendor/mail/**` (Laravel mail HTML/text components)
- Create: `resources/views/vendor/mail/html/themes/halden.css`
- Modify: `resources/views/vendor/mail/html/header.blade.php` (only if logo branch would show Laravel mark; prefer CSS-only)
- Modify: `app/Mail/ReservationConfirmed.php` (set `$theme`)

**Interfaces:**
- Consumes: Laravel published mail Markdown components
- Produces: `theme` name `halden` on `ReservationConfirmed`

- [ ] **Step 1: Publish mail views**

```bash
php artisan vendor:publish --tag=laravel-mail --no-interaction
```

Expected: `resources/views/vendor/mail/html/` and `text/` exist, including `themes/default.css`.

- [ ] **Step 2: Add `halden.css`**

Create `resources/views/vendor/mail/html/themes/halden.css` by copying `default.css`, then set these brand overrides (keep the rest of the structure; remove shadows):

```css
body {
    background-color: #F8F7F3;
    color: #1D1D1D;
    font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

a {
    color: #1D1D1D;
}

h1, h2, h3 {
    color: #1D1D1D;
}

.wrapper {
    background-color: #F8F7F3;
}

.header {
    background-color: #1F1D1B;
    padding: 28px 0;
    text-align: center;
}

.header a {
    color: #F8F7F3;
    font-size: 22px;
    font-weight: 400;
    letter-spacing: -0.02em;
    text-decoration: none;
}

.body {
    background-color: #F8F7F3;
    border-bottom: 1px solid #F8F7F3;
    border-top: 1px solid #F8F7F3;
}

.inner-body {
    background-color: #FFFFFF;
    border-color: #DEDBD3;
    border-radius: 0;
    border-width: 1px;
    box-shadow: none;
}

.footer p,
.footer a {
    color: #1D1D1D;
    opacity: 0.6;
}

.content-cell {
    padding: 32px;
}

p {
    color: #1D1D1D;
    font-size: 16px;
}
```

Also update any remaining `#fafafa` / `#e4e4e7` / blue button colors in the copied file to cream / line / ink so nothing Laravel-default remains visible. Buttons (if unused) may stay but must not use bright blue — use `#1F1D1B` fill and `#F8F7F3` text if present.

- [ ] **Step 3: Point the mailable at the theme**

In `app/Mail/ReservationConfirmed.php`:

```php
class ReservationConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public string $theme = 'halden';

    // ...
}
```

- [ ] **Step 4: Header wordmark**

Published `header.blade.php` shows a Laravel logo image when the slot equals `Laravel`. With `APP_NAME=Halden`, the text branch is used. Leave the file as published unless a smoke render shows the Laravel logo — then force the text branch:

```blade
@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
{!! $slot !!}
</a>
</td>
</tr>
```

Cream-on-bar comes from `halden.css` (`.header` / `.header a`).

- [ ] **Step 5: Assert brand colors in the create test**

Add inside the same `Mail::assertSent` closure:

```php
$mail->assertSeeInHtml('#F8F7F3');
$mail->assertSeeInHtml('#1F1D1B');
$mail->assertSeeInHtml('#1D1D1D');
```

- [ ] **Step 6: Run guest create tests**

```bash
php artisan test --compact tests/Feature/Guest/GuestReservationCreateTest.php
```

Expected: all PASS.

- [ ] **Step 7: Pint + commit**

```bash
vendor/bin/pint --dirty --format agent
git add app/Mail/ReservationConfirmed.php resources/views/vendor/mail resources/views/mail/reservation-confirmed.blade.php tests/Feature/Guest/GuestReservationCreateTest.php
git commit -m "$(cat <<'EOF'
feat(mail): add Halden-branded confirmation theme

EOF
)"
```

---

### Task 4: Document Gmail SMTP in `.env.example`

**Files:**
- Modify: `.env.example`

**Interfaces:**
- Consumes: none (docs only)
- Produces: commented Gmail SMTP recipe; default `MAIL_MAILER=log`

- [ ] **Step 1: Update mail section in `.env.example`**

Replace the mail block with:

```env
MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="Halden"

# Real inbox demo (Gmail App Password):
# MAIL_MAILER=smtp
# MAIL_SCHEME=smtp
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=your.email@gmail.com
# MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
# MAIL_FROM_ADDRESS=your.email@gmail.com
# MAIL_FROM_NAME="Halden"
```

Do not put a real App Password in the repo. Operator copies the commented block into local `.env` and runs `php artisan config:clear`.

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "$(cat <<'EOF'
docs(env): document Gmail SMTP for confirmation mail demo

EOF
)"
```

---

## Manual acceptance (operator)

1. Create a Gmail App Password; paste into local `.env` using the commented recipe.
2. `php artisan config:clear`
3. Create a guest reservation to your own inbox.
4. Confirm subject, cream/bar look, and BRAND copy; check spam if needed.
5. Flip `MAIL_MAILER` back to `log` for daily local work.

---

## Spec coverage check

| Spec item | Task |
| --- | --- |
| Create-only mail | Unchanged controller; no cancel mail tasks |
| Gmail via `.env` | Task 4 |
| Subject / from / body copy | Tasks 1–2 |
| Cream / bar / ink theme | Task 3 |
| Tests + no SMTP in CI | Tasks 1, 3 |
| Out of scope (queues, Resend, marks) | Not planned |
