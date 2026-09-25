# Halden

Brand for the restaurant table reservation trial. Visual reference: [SevenRooms](https://sevenrooms.com/). Halden is its own dining room. Do not use the SevenRooms name, logo, photography, or licensed fonts.

## Restaurant

|            |                                                                  |
| ---------- | ---------------------------------------------------------------- |
| Name       | Halden                                                           |
| Line       | A table, when you want it.                                       |
| What it is | One dining room. Lunch and dinner.                               |
| Hours      | 11:00–21:00. Last seating 19:00. Each table is held for 2 hours. |
| Tables     | Two 2-tops, two 4-tops, one 6-top.                               |

The public site is the guest's way to reserve and to manage a booking. The reservation list uses the same colors, with less display type.

## What to take from the reference

SevenRooms presents reservations as hospitality, not as a form.

- A warm near-black bar across the top, cream page underneath.
- A large serif headline, regular weight, tight tracking. UI text is a plain sans.
- One filled pill button for the action that matters. A second action is an outline pill.
- Short lines. "More than just reservations." "Welcome to the table."
- Real service in the photography: a host, a table, daylight. No icon grids.

Halden keeps that structure and drops the SaaS layer. There is no pricing, demo, or platform menu. The primary action is **Reserve**.

## Color

| Token   | Hex       | Use                                          |
| ------- | --------- | -------------------------------------------- |
| `bar`   | `#1F1D1B` | Header, footer, filled buttons on cream      |
| `cream` | `#F8F7F3` | Page background, text and buttons on the bar |
| `ink`   | `#1D1D1D` | Headlines and body                           |
| `line`  | `#DEDBD3` | Borders, dividers, empty table cards         |
| `paper` | `#FFFFFF` | Forms and reservation cards                  |
| `moss`  | `#2F4A3C` | Confirmed                                    |
| `clay`  | `#8A4B3B` | Cancelled, and any blocking error            |

No bright blue, no gradients, no drop shadows. Cards sit on cream with a 1px `line` border.

## Type

The reference uses a custom serif for headlines and a custom sans for the interface. Use stand-ins that are free to ship:

| Role      | Face            | Notes                                                                       |
| --------- | --------------- | --------------------------------------------------------------------------- |
| Headlines | Fraunces        | Regular, tight tracking. Guest pages only.                                  |
| Interface | Instrument Sans | Already loaded by this app. Navigation, forms, the reservation list, email. |

| Style   | Size                                         | Use                                 |
| ------- | -------------------------------------------- | ----------------------------------- |
| Display | 56–68px, weight 400                          | Guest page title                    |
| Title   | 32px, weight 400, Fraunces                   | Confirmation heading                |
| Section | 20px, weight 500, Instrument Sans            | Form groups, reservation list title |
| Body    | 16px, weight 400                             | Paragraphs and fields               |
| Label   | 14px, weight 600, uppercase, slight tracking | Buttons and status                  |

## Buttons

Pills, fully rounded.

- **Primary:** `bar` fill, `cream` text. Label is uppercase. Guest primary is **Reserve**. Staff primary is **Save**.
- **Secondary:** transparent, 2px `cream` border when on the bar, 2px `bar` border when on cream.
- **Quiet:** text only, `ink`, for Cancel reservation.

One primary button per screen.

## Voice

Write like a host. Short sentences. Name the table, the day, and the time.

Use:

- Reserve a table
- Party size
- You're booked
- Table 4 is free at 19:00
- We held this table for two hours

Avoid:

- Submit, utilize, user, booking request, ASAP
- Exclamation marks
- "Get a demo" and other product-marketing lines

## Screens

The public site is a set of pages, the way the reference is. The bar carries **Halden**, then **Menu**, **Private dining**, **Our story**, **Contact**, **Reservations**, and **Reserve** as the filled pill. Page-by-page layout is in `docs/guest-frontend.md`. Guests manage bookings themselves. There is no staff login.

### Home (`/`)

Headline: **A table, when you want it.**

Support: **Lunch and dinner at Halden. Last seating is 19:00.**

Filled button: **Reserve.**

### Reserve (`/reserve`)

Headline: **Reserve a table.**

Support: Lunch and dinner, 11:00 to 21:00. Last seating is 19:00.

The finder is one row: date, party size, time. Choosing them reveals table cards. Each card shows the table name, how many it seats, and **Reserve**. A table that is too small or already held does not appear. If nothing is free: **Nothing open at that time. Try another hour.**

### Menu (`/menu`)

Headline: **Lunch and dinner.**

Two lists, lunch and dinner. Each dish has a name and a short line. No prices in this trial.

### Private dining (`/private`)

Headline: **The long table.**

Support: **Table 5 seats six. We hold it for two hours, same as every other table.**

Button: **Reserve.**

### Our story (`/about`)

Headline: **Welcome to the table.**

One short story about the room. No team grid, no careers page.

### Contact (`/contact`)

Headline: **Visit Halden.**

18 Mercer Lane. Lunch and dinner, 11:00 to 21:00. Last seating 19:00. `hello@halden.test`.

### Confirmation

Headline: **You're booked.**

Then the facts, in this order: guest name, table, date, time, party size. A line under them: **This table is yours for two hours.**

### Reservation list (`/reservations`)

No display serif. Title: **Reservations.**

Search placeholder: **Name, email, or phone.**

Filters: date, status, party size, table. Status reads **Confirmed** in moss or **Cancelled** in clay.

Row actions: **Edit** and **Cancel reservation.**

### Edit

Title is the guest name. Button: **Save.** Quiet action: **Cancel reservation.**

If the new time is taken: **That table is already held then.**

## Email

From name: **Halden**.

Subject: **Your table at Halden**.

Body:

> [Guest name], your table is booked.
>
> [Table] · [date] · [time] · party of [n]
>
> We will hold it for two hours.
>
> Halden

## Mark

Wordmark only: **Halden** set in Fraunces, cream on the bar, ink on paper. No symbol borrowed from the reference. A mark can be added later. It should be a simple circle or monogram, not a copy of the SevenRooms emblem.
