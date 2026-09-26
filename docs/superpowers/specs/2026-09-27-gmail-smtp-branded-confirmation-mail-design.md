# Gmail SMTP + branded confirmation mail

## Goal

Deliver the existing create-time `ReservationConfirmed` email to a real inbox via Gmail SMTP for the trial demo, and restyle the message to match Halden’s cream / bar / ink branding and host voice from `docs/BRAND.md`.

## Locked decisions

- **Scope:** create confirmation only; no cancel or update mail
- **Delivery:** Gmail SMTP via `.env` (App Password); day-to-day local stays `MAIL_MAILER=log`
- **Send path:** unchanged — `Guest\ReservationController@store` after a successful create
- **Mailable:** keep `App\Mail\ReservationConfirmed`; update subject and view/theme only
- **Copy + look:** follow `docs/BRAND.md` Email section and Color tokens
- **Out of scope:** queues, Resend/Mailgun, staff notifications, logo mark beyond wordmark text

## Delivery (config only)

Demo / real-send `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<gmail address>
MAIL_PASSWORD=<16-char App Password>
MAIL_FROM_ADDRESS=<same gmail address>
MAIL_FROM_NAME="Halden"
```

Local default remains `MAIL_MAILER=log`. No changes to `config/mail.php` structure beyond what env already drives. Secrets stay out of git.

## Message

| Field | Value |
| --- | --- |
| From name | Halden |
| Subject | Your table at Halden |
| To | reservation guest email |

Body (minimal host voice):

> [Guest name], your table is booked.
>
> [Table] · [date] · [time] · party of [n]
>
> We will hold it for two hours.
>
> Halden

No status bullet list. Date formatting stays human-readable (weekday + day + month + year). Time is `HH:MM`.

## Visual design

Replace the default Laravel Markdown mail chrome (blue / generic) with a custom theme or HTML layout:

| Role | Token | Hex |
| --- | --- | --- |
| Outer / page | cream | `#F8F7F3` |
| Header bar | bar | `#1F1D1B` |
| Header wordmark | cream on bar | `#F8F7F3` |
| Body text | ink | `#1D1D1D` |
| Dividers | line | `#DEDBD3` |
| Content panel | paper | `#FFFFFF` |

Rules:

- No bright blue, gradients, or drop shadows
- Wordmark text **Halden** only (no borrowed symbol)
- Body type: Instrument Sans with system sans fallbacks (email clients often ignore webfonts)
- One quiet composition: bar header → short body on paper/cream → Halden close

Implementation approach: publish or hand-author a Laravel mail theme / custom blade so the mailable no longer uses the stock Markdown component styling as the visible brand.

## Tests

- Existing create tests keep `Mail::fake()` and assert `ReservationConfirmed` is sent
- Assert subject is `Your table at Halden` (update if current subject differs)
- No live SMTP in CI

## Acceptance

- With SMTP env set, creating a reservation delivers a branded confirmation to the guest inbox (or spam for the demo account)
- With `log` mailer, the same send writes to the log without SMTP
- Email visual tokens and copy match `docs/BRAND.md`
- Cancel / update still send no mail
