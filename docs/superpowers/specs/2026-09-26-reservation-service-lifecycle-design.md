# Reservation service lifecycle

## Goal

Give staff a service-night workflow for reservations and tables: hybrid floor occupancy (clock + overrides), plus Seat, Complete, No-show, and Walk-in on both the floor and the reservations ledger.

## Locked decisions

- **Focus:** Staff operational lifecycle (not hardening races/capacity this pass)
- **Occupancy model:** Hybrid — floor derives In service / Reserved / Open from time windows and stored status overrides
- **Actions this pass:** Seat, Complete, No-show, Walk-in
- **Slot freeing:** Complete and No-show stop blocking availability immediately
- **Surface:** Both floor (tonight) and reservations ledger (any date)
- **Data model:** Single expanded `ReservationStatus` enum (Approach 1)
- **Out of scope:** Reassign table, undo/reconfirm from terminal states, double-booking race locks, capacity-shrink rules, guest self-cancel

## Status model

**Statuses:** `confirmed` | `seated` | `completed` | `no_show` | `cancelled`

| From | Action | To |
|------|--------|-----|
| confirmed | Seat | seated |
| confirmed | Cancel | cancelled |
| confirmed | No-show | no_show |
| seated | Complete | completed |
| seated | Cancel | cancelled |
| completed / no_show / cancelled | — | terminal |

### Rules

- Guest and staff create land on `confirmed` (except walk-in → `seated`).
- Seat is allowed whenever status is `confirmed` (early, during, or after the scheduled window — late arrivals still Seat; use No-show if they never come).
- No-show only from `confirmed` (not after seated — use Complete or Cancel).
- Availability blocks only `confirmed` and `seated`.
- Seat is **idempotent**: seating an already-`seated` reservation succeeds without error.
- Other invalid transitions return 422 with a clear message.

## Floor display

Per table, for **today**, among bookings that still matter for occupancy:

| Status | Condition | Card preview |
|--------|-----------|--------------|
| In service | A `seated` booking exists, **or** a `confirmed` booking whose 2-hour window contains now | That booking |
| Reserved | No in-service; a later-today `confirmed` exists | Next upcoming |
| Open | No `confirmed` / `seated` left for today | “Available for walk-in” |

`completed`, `no_show`, and `cancelled` never drive In service or Reserved.

Lunch vs Dinner follows the existing resource rule: hour &lt; 15 → Lunch, otherwise Dinner. Window remains `[starts_at, starts_at + 2h)`.

## Walk-in

- Primary entry: **Open** table on the floor (also available from the ledger with table + time).
- Creates a reservation with `status = seated`, `reserved_on = today`, guest/party fields required.
- `starts_at`: snap to the current hour if it is a valid start time (`11:00`–`19:00`). Outside service hours → reject with a clear message.
- Still enforces capacity and overlap against `confirmed` / `seated` only.

## UI surfaces

### Floor (today)

- Table schedule modal rows:
  - `confirmed` → Seat, No-show (and existing cancel if already exposed)
  - `seated` → Complete
- Open table → Walk-in CTA

### Reservations ledger

- Same actions on each row, gated by the same transition rules (any date).
- Status badges updated for the new enum values.

## Backend

Prefer dedicated staff action endpoints so transitions stay explicit:

- `POST /staff/reservations/{reservation}/seat`
- `POST /staff/reservations/{reservation}/complete`
- `POST /staff/reservations/{reservation}/no-show`
- `POST /staff/reservations/walk-in`

Authorization: existing staff reservation policies (`create` / `update` as appropriate).

Cancel remains soft-cancel via the existing destroy → `cancelled` path.

Update `EnsuresTableAvailability` (and any list-available helpers) so only `confirmed` and `seated` count as overlapping blockers.

## Edge cases (locked)

- Wrong-status Seat / Complete / No-show → 422 (Seat idempotent exception above).
- Complete or No-show frees the remainder of the window for walk-ins / new bookings immediately.
- Walk-in that overlaps an existing `confirmed`/`seated` → validation failure.
- Walk-in over table capacity → validation failure.
- Hardening (DB unique slot lock, past-date edits, shrinking capacity under future bookings): deferred.

## Testing

Pest feature coverage:

- Transition matrix: allowed paths + forbidden paths (422).
- Idempotent Seat when already seated.
- Availability: `completed` / `no_show` / `cancelled` do not block; `seated` does.
- Floor/dashboard (or tables page) props: seated drives in-service; completed today does not block Open.
- Walk-in happy path creates `seated` and is visible for the table today.
- Walk-in capacity and overlap failures.
- Staff-only auth on the new endpoints.
