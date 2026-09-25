# Floor table schedule modal

## Goal

Staff dashboard floor shows live occupancy for **today**, and clicking a table opens a modal of that table’s today’s confirmed bookings (time, Lunch/Dinner, guest, party).

## Locked decisions

- **Day scope:** today only (no date picker)
- **Interaction:** modal on table click
- **Data:** live floor + modal (replace mock floor state)
- **Status labels:** In service / Reserved / Open
- **Out of scope this pass:** seat/reset/edit actions; replacing the mock ReservationList below the floor; date picker; API query filters dedicated to the floor

## Status derivation

For each table, among today’s confirmed reservations for that `table_id`, using a 2-hour seated window `[starts_at, starts_at + 2h)` on today:

| Status     | Condition                                           | Card preview            |
| ---------- | --------------------------------------------------- | ----------------------- |
| In service | A window contains “now”                             | That booking            |
| Reserved   | No in-progress window; a booking starts later today | Next upcoming booking   |
| Open       | No confirmed bookings today                         | “Available for walk-in” |

Lunch vs Dinner follows the existing resource rule: hour &lt; 15 → Lunch, otherwise Dinner.

## Data flow

`DashboardController` authorizes staff view access and passes:

- `tables` — `TableResource` collection
- `reservations` — today’s confirmed only, eager-loaded `table`, ordered by `starts_at`
- `today` — `Y-m-d`

The floor derives card state client-side. The modal filters the same `reservations` prop by `table_id`.

## UI

- Floor cards are clickable; live table count in the header
- Badges: In service / Reserved / Open (replace Occupied)
- Remove Reset
- Modal: table name + capacity; “Today · {date}”; rows with time window, service, guest, party, notes; empty state; close via X / backdrop / Escape; optional link to Reservations ledger

## Testing

Feature test: authenticated staff receives tables and today’s confirmed reservations; cancelled-today and tomorrow bookings are excluded from the `reservations` prop.
