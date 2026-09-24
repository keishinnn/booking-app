# Restaurant table reservation

Spec for the full-stack trial. One Laravel app, React pages through Inertia, MySQL.

## Auth

Guests do not create accounts. They book from the public page.

Staff do log in. The reservation list can update or cancel any booking, so it stays behind one seeded staff account. No registration page, no guest accounts, and no roles. Laravel session auth on the existing `users` table is enough.

Seed one staff user: `staff@restaurant.test` / `password`.

## Product rules

- One restaurant. Tables are seeded, not managed in the UI.
- A guest picks a date, a party size, and a start time, then chooses a free table.
- Service hours are 11:00–21:00. Start times are on the hour. The last start time is 19:00.
- Every reservation lasts 2 hours. A 19:00 booking occupies the table until 21:00.
- A table is offered only when `capacity >= party_size` and no **confirmed** reservation on that table overlaps the requested window on that date.
- Cancelled reservations do not block a table.
- Creating a reservation sets status to `confirmed` and emails the guest.
- Cancelling sets status to `cancelled` and keeps the row.
- Updating date, time, party size, or table uses the same availability rule and ignores the reservation being edited.

## Data

### `tables`

| Column | Notes |
| --- | --- |
| id | |
| name | unique, e.g. "Table 1" |
| capacity | integer, at least 1 |
| timestamps | |

Seed: Table 1–2 capacity 2, Table 3–4 capacity 4, Table 5 capacity 6.

### `reservations`

| Column | Notes |
| --- | --- |
| id | |
| table_id | foreign key, restrict on delete |
| guest_name | required |
| email | required |
| phone | required |
| party_size | integer, at least 1, not above the chosen table's capacity |
| reserved_on | date |
| starts_at | time, one of 11:00–19:00 |
| status | `confirmed` or `cancelled`, default `confirmed` |
| notes | nullable |
| timestamps | |

Index `(table_id, reserved_on, status)` for the overlap check.

Switch `.env` from SQLite to MySQL before the first migration of these tables.

## Pages

| Route | Who | Page | Behavior |
| --- | --- | --- | --- |
| `GET /` | guest | `book` | Date, party size, and time. Lists matching tables. |
| `POST /reservations` | guest | | Validates, checks overlap, saves, sends mail, redirects to confirmation. |
| `GET /reservations/{reservation}/confirmation` | guest | `confirmation` | Shows that booking only. |
| `GET /login` | guest | `login` | Staff login form. |
| `POST /login` | guest | | Session login. |
| `POST /logout` | staff | | Ends the session. |
| `GET /reservations` | staff | `reservations/index` | List, search, and filters. |
| `GET /reservations/{reservation}/edit` | staff | `reservations/edit` | Edit form. |
| `PUT /reservations/{reservation}` | staff | | Update with the availability rule. |
| `DELETE /reservations/{reservation}` | staff | | Cancel. |

Search matches guest name, email, or phone. Filters are date, status, party size, and table. Default order is newest first.

UI uses the existing Tailwind setup and shadcn/ui for the form, table, and buttons.

## Mail

Send one mailable when a reservation is created. Body includes guest name, table, date, time, party size, and status. Local mail uses the `log` driver so the message is visible without SMTP.

## Acceptance

- A guest can book a table that fits the party and is free for that 2-hour window.
- A table that is too small or already confirmed for an overlap is not offered, and a direct submit for it fails.
- Confirmation shows the saved booking, and the mail log contains the same details.
- A guest who is not logged in cannot open the list, edit, or cancel.
- Staff can search, filter, update, and cancel. A cancelled table can be booked again for that window.
- An update that collides with another confirmed reservation is rejected.

## Build order

1. MySQL connection, `tables` and `reservations` migrations, models, factories, and the table seeder.
2. Availability query and feature tests for overlap, capacity, and cancel.
3. Public book page, create action, and confirmation page.
4. Staff login and logout. Protect list, edit, update, and cancel.
5. Staff list with search and filters, then edit and cancel.
6. Confirmation mailable on create.
7. shadcn/ui on the book form, confirmation, login, and reservation list.
