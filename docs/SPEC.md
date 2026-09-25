# Restaurant table reservation

Spec for the full-stack trial. One Laravel app, React pages through Inertia, MySQL.

The trial asks for a designed booking site with working create, read, update, and delete, plus search, filtering, and an email when a table is reserved. Guests do all of that on the public site. There is no login and no staff account.

## Workflow

1. **Create.** On `/reserve`, the guest picks a date, party size, and time, chooses a free table, and enters name, email, phone, and an optional note. The reservation is saved as confirmed.
2. **Email.** Halden sends the guest the table, date, time, and party size.
3. **Read.** `/reservations` lists every reservation. The confirmation page shows the one that was just saved.
4. **Search.** The list matches guest name, email, or phone.
5. **Filter.** The list narrows by date, status, party size, or table.
6. **Update.** **Edit** changes the guest details, date, time, party size, or table. The same availability rule applies, ignoring the reservation being edited.
7. **Delete.** **Cancel reservation** sets status to `cancelled` and keeps the row, so the table can be booked again and the list can still be filtered.

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

| Column     | Notes                                                   |
| ---------- | ------------------------------------------------------- |
| id         | UUID primary key                                        |
| name       | unique, e.g. "Table 1"                                  |
| capacity   | integer, at least 1                                     |
| image_url  | nullable string; public URL or path for the table photo |
| timestamps |                                                         |

Seed: Table 1–2 capacity 2, Table 3–4 capacity 4, Table 5 capacity 6. Each seeded table gets an `image_url`.

### `reservations`

| Column      | Notes                                                      |
| ----------- | ---------------------------------------------------------- |
| id          |                                                            |
| table_id    | UUID foreign key → `tables.id`, restrict on delete         |
| guest_name  | required                                                   |
| email       | required                                                   |
| phone       | required                                                   |
| party_size  | integer, at least 1, not above the chosen table's capacity |
| reserved_on | date                                                       |
| starts_at   | time, one of 11:00–19:00                                   |
| status      | `confirmed` or `cancelled`, default `confirmed`            |
| notes       | nullable                                                   |
| timestamps  |                                                            |

Index `(table_id, reserved_on, status)` for the overlap check. Also index `reserved_on`, `status`, `party_size`, `guest_name`, `email`, `phone`, and `created_at` for list filters, search, and newest-first order. On `tables`, `name` is unique and `capacity` is indexed for party-size matching.

Switch `.env` from SQLite to MySQL before the first migration of these tables.

## Pages

| Route                                          | Who   | Page                 | Behavior                                                                 |
| ---------------------------------------------- | ----- | -------------------- | ------------------------------------------------------------------------ |
| `GET /`                                        | guest | `home`               | Dining room introduction and the path to reserve.                        |
| `GET /menu`                                    | guest | `menu`               | Static lunch and dinner lists.                                           |
| `GET /private`                                 | guest | `private`            | The six-seat table, with a link to reserve.                              |
| `GET /about`                                   | guest | `about`              | Short story of the room.                                                 |
| `GET /contact`                                 | guest | `contact`            | Address, hours, and email.                                               |
| `GET /reserve`                                 | guest | `book`               | Date, party size, and time. Lists matching tables.                       |
| `POST /reservations`                           | guest |                      | Validates, checks overlap, saves, sends mail, redirects to confirmation. |
| `GET /reservations`                            | guest | `reservations/index` | List, search, and filters.                                               |
| `GET /reservations/{reservation}/confirmation` | guest | `confirmation`       | Shows that booking only.                                                 |
| `GET /reservations/{reservation}/edit`         | guest | `reservations/edit`  | Edit form.                                                               |
| `PUT /reservations/{reservation}`              | guest |                      | Update with the availability rule.                                       |
| `DELETE /reservations/{reservation}`           | guest |                      | Cancel.                                                                  |
| `GET /terms`                                   | guest | `terms`              | Static terms.                                                            |
| `GET /privacy`                                 | guest | `privacy`            | Static privacy note.                                                     |

Search matches guest name, email, or phone. Filters are date, status, party size, and table. Default order is newest first.

UI uses the existing Tailwind setup and shadcn/ui for the form, table, and buttons.

## Mail

Send one mailable when a reservation is created. Body includes guest name, table, date, time, party size, and status. Local mail uses the `log` driver so the message is visible without SMTP.

## Acceptance

- A guest can book a table that fits the party and is free for that 2-hour window.
- A table that is too small or already confirmed for an overlap is not offered, and a direct submit for it fails.
- Confirmation shows the saved booking, and the mail log contains the same details.
- The public list can be searched and filtered, then a reservation can be updated or cancelled without logging in.
- A cancelled table can be booked again for that window.
- An update that collides with another confirmed reservation is rejected.

## Build order

1. MySQL connection, `tables` and `reservations` migrations, models, factories, and the table seeder.
2. Availability query and feature tests for overlap, capacity, and cancel.
3. Public pages from `docs/guest-frontend.md`, then create and the confirmation page.
4. Public reservation list with search and filters, then update and cancel.
5. Confirmation mailable on create.
6. shadcn/ui on the book form, confirmation, and reservation list.
