# Guest frontend

Plan for every public Halden page. Copy and color come from `docs/BRAND.md`. Availability rules and the booking workflow come from `docs/SPEC.md`.

The reference site is a full visit: a bar, a home page, several content pages, a footer, and one filled action. Halden keeps that shape and drops the software catalog. There is no pricing, demo, blog, careers, or platform menu.

Guests do not log in. They create a reservation, then read, search, filter, update, and cancel from the public list. Mail goes out when a reservation is created.

## Bar and footer

Both live in `resources/js/layouts/guest-layout.tsx` and wrap every page below.

Bar, `#1F1D1B`:

| Item           | Destination     | Treatment                                                    |
| -------------- | --------------- | ------------------------------------------------------------ |
| Halden         | `/`             | Fraunces wordmark, cream                                     |
| Menu           | `/menu`         | Cream text                                                   |
| Private dining | `/private`      | Cream text                                                   |
| Our story      | `/about`        | Cream text                                                   |
| Contact        | `/contact`      | Cream text                                                   |
| Reservations   | `/reservations` | Cream text                                                   |
| Reserve        | `/reserve`      | Filled cream pill, ink text. This is the one primary action. |

Below the `lg` breakpoint, the wordmark and **Reserve** stay visible. The other links sit behind a **Menu** button.

Footer, same bar, four lines:

- 18 Mercer Lane
- Lunch and dinner, 11:00 to 21:00. Last seating 19:00.
- Terms → `/terms`
- Privacy → `/privacy`

Page background is cream `#F8F7F3`. Text is ink `#1D1D1D`. Cards are white with a 1px `#DEDBD3` border. No shadow and no gradient. Display type is Fraunces. Interface type is Instrument Sans. Display size is 56px from `lg` up, and 40px below it.

## Pages

| Route                                          | File                                        | Kind                              |
| ---------------------------------------------- | ------------------------------------------- | --------------------------------- |
| `GET /`                                        | `resources/js/pages/home.tsx`               | Static                            |
| `GET /menu`                                    | `resources/js/pages/menu.tsx`               | Static                            |
| `GET /private`                                 | `resources/js/pages/private.tsx`            | Static                            |
| `GET /about`                                   | `resources/js/pages/about.tsx`              | Static                            |
| `GET /contact`                                 | `resources/js/pages/contact.tsx`            | Static                            |
| `GET /reserve`                                 | `resources/js/pages/book.tsx`               | Create                            |
| `POST /reservations`                           |                                             | Saves, sends mail, then redirects |
| `GET /reservations`                            | `resources/js/pages/reservations/index.tsx` | Read, search, filter, cancel      |
| `GET /reservations/{reservation}/confirmation` | `resources/js/pages/confirmation.tsx`       | Read                              |
| `GET /reservations/{reservation}/edit`         | `resources/js/pages/reservations/edit.tsx`  | Update                            |
| `PUT /reservations/{reservation}`              |                                             | Saves the edit                    |
| `DELETE /reservations/{reservation}`           |                                             | Sets status to cancelled          |
| `GET /terms`                                   | `resources/js/pages/terms.tsx`              | Static                            |
| `GET /privacy`                                 | `resources/js/pages/privacy.tsx`            | Static                            |

### Home

The arrival page. It does not contain the finder.

1. Split hero. Left: **A table, when you want it.** Support: **Lunch and dinner at Halden. Last seating is 19:00.** Button: **Reserve**, linking to `/reserve`. Right: a photograph of a set table in daylight. Use one local image, not a SevenRooms asset.
2. A cream band. Headline: **Welcome to the table.** One paragraph on the room: a single dining room, lunch and dinner, tables held for two hours.
3. Three bands, each with a headline, two sentences, and a text link:
    - **Reserve a table.** Link: **Reserve** → `/reserve`
    - **Lunch and dinner.** Link: **See the menu** → `/menu`
    - **The long table.** Link: **Private dining** → `/private`
4. Closing band on the bar, cream type: **Ready for a table?** Button: **Reserve.**

### Menu

Headline: **Lunch and dinner.**

Support: **Served from 11:00. Last seating is 19:00.**

Two groups on white cards.

Lunch:

| Dish        | Line                          |
| ----------- | ----------------------------- |
| Greens      | Leaves, lemon, oil            |
| Market soup | Whatever came in this morning |
| Chicken     | Roast, bread, a green salad   |

Dinner:

| Dish      | Line                   |
| --------- | ---------------------- |
| Crudo     | Citrus, salt           |
| Pasta     | The sauce of the day   |
| Steak     | For the table to share |
| Chocolate | A small finish         |

No prices. A text link under the cards: **Reserve a table.**

### Private dining

Headline: **The long table.**

Support: **Table 5 seats six. We hold it for two hours, same as every other table.**

Body: the table is in the room, not a separate salon. A guest books it the same way as any other table, with a party of six.

Button: **Reserve**, linking to `/reserve`.

### Our story

Headline: **Welcome to the table.**

Three short paragraphs. Halden is one dining room. Service runs from 11:00 to 21:00. A reservation holds a table for two hours, and the last seating is 19:00. No staff portraits and no timeline.

Text link: **Reserve a table.**

### Contact

Headline: **Visit Halden.**

A white card:

- 18 Mercer Lane
- Lunch and dinner, 11:00 to 21:00
- Last seating 19:00
- hello@halden.test

No contact form. A reservation is made on `/reserve`.

### Reserve

Headline: **Reserve a table.**

Support: **Lunch and dinner, 11:00 to 21:00. Last seating is 19:00.**

Finder, one row from `lg` up and a stack below it:

| Field      | Control    | Values                           |
| ---------- | ---------- | -------------------------------- |
| Date       | date input | Today or later                   |
| Party size | select     | 1 through 6                      |
| Time       | select     | 11:00 through 19:00, on the hour |

Changing a field visits `GET /reserve` with `date`, `party_size`, and `starts_at`. Use an Inertia `<Form method="get">`. The server returns tables that fit the party and are free for the two-hour window. The page does not decide availability.

```ts
type BookPageProps = {
    filters: {
        date: string | null;
        party_size: number | null;
        starts_at: string | null;
    };
    tables: Array<{
        id: string;
        name: string;
        capacity: number;
        image_url: string | null;
    }>;
};
```

Until all three filters are set, show no cards. When they are set and `tables` is empty: **Nothing open at that time. Try another hour.**

Each card shows the table photo (or a cream placeholder if `image_url` is null), the table name, **Seats {capacity}**, and **Reserve**. **Reserve** opens one guest form under the cards. Another card replaces that form.

The form line: **{Table name} is free at {time}.**

| Field | Name         | Required |
| ----- | ------------ | -------- |
| Name  | `guest_name` | yes      |
| Email | `email`      | yes      |
| Phone | `phone`      | yes      |
| Note  | `notes`      | no       |

Hidden fields: `table_id`, `reserved_on`, `starts_at`, `party_size`. Submit with `<Form method="post">` to `POST /reservations`. The button reads **Reserve** and disables while `processing`. Field errors render in clay `#8A4B3B` under the field. If the table was taken: **That table is already held then.**

### Confirmation

```ts
type ConfirmationPageProps = {
    reservation: {
        guest_name: string;
        party_size: number;
        reserved_on: string;
        starts_at: string;
        table: {
            name: string;
        };
    };
};
```

Headline, Fraunces at 32px: **You're booked.**

One white card, in this order: guest name, table name, date as `Thursday, 24 September 2026`, time as `19:00`, party size as `Party of 4`.

Under the card: **This table is yours for two hours.**

Text links: **Reservations** at `/reservations`, and **Halden** at `/`.

### Terms

Headline: **Terms.**

A few sentences: a reservation holds one table for two hours from the start time, the guest should arrive for that time, and a guest can change or cancel it from **Reservations**. This is trial copy, not a legal policy.

### Privacy

Headline: **Privacy.**

A few sentences: the reservation stores the guest's name, email, phone, party size, date, time, and optional note so the table can be held and a confirmation can be sent. This is trial copy, not a legal policy.

## Files

| File                                           | Role                                  |
| ---------------------------------------------- | ------------------------------------- |
| `resources/css/app.css`                        | Cream, ink, bar, line, clay, Fraunces |
| `resources/js/layouts/guest-layout.tsx`        | Bar, footer, mobile menu              |
| `resources/js/pages/home.tsx`                  | Arrival                               |
| `resources/js/pages/menu.tsx`                  | Lunch and dinner                      |
| `resources/js/pages/private.tsx`               | Table 5                               |
| `resources/js/pages/about.tsx`                 | The room                              |
| `resources/js/pages/contact.tsx`               | Visit                                 |
| `resources/js/pages/book.tsx`                  | Finder, cards, guest form             |
| `resources/js/pages/confirmation.tsx`          | Saved booking                         |
| `resources/js/pages/reservations/index.tsx`    | List, search, filters, cancel         |
| `resources/js/pages/reservations/edit.tsx`     | Update form                           |
| `resources/js/pages/terms.tsx`                 | Terms                                 |
| `resources/js/pages/privacy.tsx`               | Privacy                               |
| `resources/js/components/guest/table-card.tsx` | One free table                        |
| `resources/js/types/reservation.ts`            | Reserve and confirmation props        |

Use shadcn/ui `Button`, `Input`, `Label`, and `Card` on the reserve page, restyled to these tokens. Link with Inertia `<Link>`. Wire the reservation post with Wayfinder once the named routes exist.

## Build order

1. Tokens, Fraunces, guest layout, bar, and footer.
2. Home, menu, private dining, our story, contact, terms, and privacy.
3. Reserve finder reloading `/reserve` with the three query params.
4. Table cards, including the empty line, and the guest form.
5. Confirmation page.
6. Reservation list with search, filters, edit, and cancel.
7. Field errors and the held-table message.

## Done when

- Every page in the table above renders inside the same bar and footer.
- **Reserve** in the bar lands on `/reserve` from any public page.
- Home introduces the room and does not show the finder.
- Menu, private dining, our story, contact, terms, and privacy are readable without a booking.
- A guest can book a free table and land on **You're booked.**
- **Reservations** lists bookings, searches name, email, or phone, and filters by date, status, party size, and table.
- **Edit** saves a change. **Cancel reservation** marks it cancelled and frees the table.
- Narrow screens keep **Halden** and **Reserve** on the bar and tuck the other links into **Menu**.
