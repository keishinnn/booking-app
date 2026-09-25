# Guest reservation create flow

## Goal

Wire the guest `/reserve` form so choosing date, party, time, and table, then submitting guest details, creates a real confirmed reservation, emails the guest (log driver), and lands on a confirmation page.

## Locked decisions

- **Scope:** create only (no public list / edit / cancel this pass)
- **Approach:** dedicated guest controllers and FormRequest; staff CRUD stays on `/staff/reservations`
- **Availability:** capacity ≥ party size and no overlapping **confirmed** 2-hour window (reuse `EnsuresTableAvailability`)
- **IDs:** live UUID table ids (replace hardcoded numeric 1–5 mocks on `/reserve`)
- **Success path:** redirect to confirmation page (not inline flash success as primary UX)
- **Mail:** `ReservationConfirmed` mailable on create; local `log` driver

## Routes

| Method | Path | Handler | Name |
| --- | --- | --- | --- |
| GET | `/reserve` | `Guest\ReserveController` | `reserve` |
| POST | `/reservations` | `Guest\ReservationController@store` | `reservations.store` |
| GET | `/reservations/{reservation}/confirmation` | `Guest\ReservationController@confirmation` | `reservations.confirmation` |

Staff routes remain under the `staff.` prefix and do not use these names for path collision (staff POST is `/staff/reservations`).

## Backend

### Reserve (GET)

- Query: `date`, `party_size`, `starts_at`, `table_id`, `step`
- Step 2 requires all filters + `table_id`; otherwise fall back to step 1
- When `date`, `party_size`, and `starts_at` are present, return tables that fit capacity and pass availability for that window
- Props: `filters`, `tables` (id, name, capacity, image_url), `startTimes` optional if useful to frontend

### Store (POST)

- `StoreGuestReservationRequest`: `authorize()` returns `true`
- Rules mirror staff create fields without `status`; after-validate calls `EnsuresTableAvailability`
- Create with `status = confirmed`
- Send `ReservationConfirmed` to the guest email
- Redirect to `reservations.confirmation`

### Confirmation (GET)

- Public show of one reservation with `table` loaded
- No auth; anyone with the URL can view (acceptable for this trial)

## Frontend

- Booking types: string UUID `table_id` / table `id`
- Table picker / book page: use live `image_url`; soft decorative tags may stay keyed by table name
- Guest form: Wayfinder `store` → guest `POST /reservations`; remove primary inline success UI in favor of confirmation redirect
- New confirmation page: **You're booked.** + guest, table, date, time, party; **This table is yours for two hours.**; link home (skip Reservations list until that page exists)

## Mail body

Guest name, table name, date, time, party size, status.

## Tests

- Available tables exclude too-small and overlapping confirmed bookings
- Guest create persists confirmed row, sends mail, redirects to confirmation
- Overlap / over-capacity submit fails validation
- Cancelled reservation does not block the window

## Out of scope

Public reservation list, edit, cancel, and guest self-service search/filters.
